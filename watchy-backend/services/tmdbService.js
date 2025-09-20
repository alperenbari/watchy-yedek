
const axios = require('axios');
const normalize = require('./normalize');
const {
  withTmdbAuth,
  hasTmdbCredentials,
  missingCredentialsMessage
} = require('../config/tmdb');

const JUSTWATCH_GRAPHQL_URL = 'https://apis.justwatch.com/graphql';
const JUSTWATCH_PLATFORM_WEB = 'WEB';

function ensureCredentials() {
  if (!hasTmdbCredentials()) {
    throw new Error(missingCredentialsMessage());
  }
}

async function getCredits(movieId) {
  ensureCredentials();
  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      withTmdbAuth()
    );

    const crew = res.data.crew || [];
    const cast = res.data.cast || [];

    const director = crew.find(person => person.job === 'Director')?.name || null;
    const topCast = cast.slice(0, 5).map(actor => actor.name);

    return { director, cast: topCast };
  } catch (err) {
    console.error(`🎬 Credits alınamadı (ID: ${movieId}):`, err.message);
    return { director: null, cast: [] };
  }
}

async function searchMoviesWithCredits(query) {
  ensureCredentials();
  const MAX_PAGES = 30;
  const seen = new Set();
  const filtered = [];
  const sortOptions = ['popularity.desc', 'release_date.desc'];

  for (const sort of sortOptions) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        withTmdbAuth({
          params: {
            with_origin_country: 'US',
            language: 'en-US',
            include_adult: false,
            sort_by: sort,
            page
          }
        })
      );

      const results = response.data.results || [];

      const matches = results.filter(film =>
        film.title && normalize(film.title).includes(query)
      );

      for (const film of matches) {
        if (!seen.has(film.id)) {
          seen.add(film.id);
          const { director, cast } = await getCredits(film.id);

          filtered.push({
            movie_id: film.id,
            title: film.title,
            poster_path: film.poster_path,
            overview: film.overview,
            release_date: film.release_date,
            director,
            cast
          });
        }
      }

      if (response.data.total_pages <= page) break;
    }
  }

  return filtered;
}

const REGION_TURKEY = 'TR';
const CATEGORY_PRIORITY = ['flatrate', 'free', 'ads', 'rent', 'buy'];

const WATCH_LINK_CACHE = new Map();
const IMDB_ID_CACHE = new Map();

function getCacheKey(movieId, suffix = '') {
  return `${movieId}::${suffix}`;
}

async function getImdbId(movieId) {
  if (IMDB_ID_CACHE.has(movieId)) {
    return IMDB_ID_CACHE.get(movieId);
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/external_ids`,
      withTmdbAuth()
    );

    const imdbId = response.data?.imdb_id || null;
    IMDB_ID_CACHE.set(movieId, imdbId);
    return imdbId;
  } catch (error) {
    console.error(`🎬 IMDb kimliği alınamadı (ID: ${movieId}):`, error.message);
    IMDB_ID_CACHE.set(movieId, null);
    return null;
  }
}

async function fetchWatchLinks(movieId) {
  const cacheKey = getCacheKey(movieId, 'justwatch');
  if (WATCH_LINK_CACHE.has(cacheKey)) {
    return WATCH_LINK_CACHE.get(cacheKey);
  }

  const imdbId = await getImdbId(movieId);

  if (!imdbId || !/^tt\d+$/.test(imdbId)) {
    WATCH_LINK_CACHE.set(cacheKey, new Map());
    return new Map();
  }

  const justWatchId = `tm${imdbId.slice(2)}`;

  const query = `
    query GetOffers($id: ID!, $country: Country!, $platform: Platform!) {
      node(id: $id) {
        __typename
        ... on Movie {
          offers(country: $country, platform: $platform) {
            standardWebURL
            monetizationType
            presentationType
            package { packageId }
          }
        }
        ... on Show {
          offers(country: $country, platform: $platform) {
            standardWebURL
            monetizationType
            presentationType
            package { packageId }
          }
        }
      }
    }
  `;

  try {
    const response = await axios.post(JUSTWATCH_GRAPHQL_URL, {
      query,
      variables: {
        id: justWatchId,
        country: REGION_TURKEY,
        platform: JUSTWATCH_PLATFORM_WEB
      }
    });

    const offers = response.data?.data?.node?.offers;

    if (!Array.isArray(offers) || !offers.length) {
      WATCH_LINK_CACHE.set(cacheKey, new Map());
      return new Map();
    }

    const providerLinks = new Map();

    offers.forEach((offer) => {
      const providerId = offer?.package?.packageId;
      const url = offer?.standardWebURL;

      if (!providerId || !url || providerLinks.has(String(providerId))) {
        return;
      }

      providerLinks.set(String(providerId), {
        url,
        monetizationType: offer?.monetizationType || null,
        presentationType: offer?.presentationType || null
      });
    });

    WATCH_LINK_CACHE.set(cacheKey, providerLinks);
    return providerLinks;
  } catch (error) {
    console.error(
      `🎬 JustWatch GraphQL bağlantıları alınamadı (ID: ${movieId}):`,
      error.message
    );
    WATCH_LINK_CACHE.set(cacheKey, new Map());
    return new Map();
  }
}

async function getWatchProviders(movieId) {
  ensureCredentials();
  const res = await axios.get(
    `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`,
    withTmdbAuth()
  );

  const results = res.data?.results || {};
  const regionInfo = results[REGION_TURKEY];
  if (!regionInfo) {
    return { platforms: [], link: '' };
  }

  const providerMap = new Map();

  CATEGORY_PRIORITY.forEach((category) => {
    const providers = Array.isArray(regionInfo[category])
      ? regionInfo[category]
      : [];

    providers.forEach((provider) => {
      const key = provider?.provider_id || provider?.provider_name;
      if (!key) return;

      const existing = providerMap.get(key);
      if (
        !existing ||
        CATEGORY_PRIORITY.indexOf(category) <
          CATEGORY_PRIORITY.indexOf(existing.availability)
      ) {
        providerMap.set(key, {
          ...provider,
          availability: category,
          region: REGION_TURKEY
        });
      }
    });
  });

  if (!providerMap.size) {
    return { platforms: [], link: '' };
  }

  const platforms = Array.from(providerMap.values()).sort((a, b) => {
    const aPriority = a.display_priority ?? Number.MAX_SAFE_INTEGER;
    const bPriority = b.display_priority ?? Number.MAX_SAFE_INTEGER;

    if (aPriority !== bPriority) {
      return aPriority - bPriority;
    }

    return a.provider_name.localeCompare(b.provider_name);
  });

  const directLinks = await fetchWatchLinks(movieId);

  const platformsWithLinks = platforms.map((platform) => {
    const providerId = platform?.provider_id || platform?.providerId;
    const matchingLink = providerId
      ? directLinks.get(String(providerId)) || directLinks.get(providerId)
      : null;

    return {
      ...platform,
      direct_link: matchingLink?.url || '',
      direct_link_provider_name:
        matchingLink?.providerName || platform?.provider_name || null,
      direct_link_monetization_type: matchingLink?.monetizationType || null,
      direct_link_presentation_type: matchingLink?.presentationType || null
    };
  });

  return {
    platforms: platformsWithLinks,
    link: regionInfo.link || ''
  };
}

module.exports = {
  searchMoviesWithCredits,
  getCredits,
  getWatchProviders
};
