
const axios = require('axios');
const normalize = require('./normalize');
const {
  withTmdbAuth,
  hasTmdbCredentials,
  missingCredentialsMessage
} = require('../config/tmdb');

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

function getCacheKey(movieId, link) {
  return `${movieId}::${link || ''}`;
}

function decodeJustWatchContext(encoded) {
  try {
    const jsonText = Buffer.from(encoded, 'base64').toString('utf-8');
    const parsed = JSON.parse(jsonText);
    return parsed;
  } catch (error) {
    return null;
  }
}

function extractProviderLinksFromHtml(html) {
  const providerLinks = new Map();
  if (typeof html !== 'string' || html.length === 0) {
    return providerLinks;
  }

  const linkRegex = /https:\/\/click\.justwatch\.com\/a\?[^"'>]+/g;
  const matches = html.matchAll(linkRegex);

  for (const match of matches) {
    const href = match[0];

    try {
      const url = new URL(href);
      const context = url.searchParams.get('cx');
      const redirect = url.searchParams.get('r');

      if (!context || !redirect) {
        continue;
      }

      const decoded = decodeJustWatchContext(context);
      if (!decoded) {
        continue;
      }

      const dataArray = Array.isArray(decoded.data) ? decoded.data : [];

      dataArray.forEach((entry) => {
        const details = entry?.data || {};
        const providerId =
          details.providerId ?? details.provider_id ?? details.providerid;
        const providerName =
          details.provider ?? details.provider_name ?? details.providerName;

        if (!providerId || providerLinks.has(providerId)) {
          return;
        }

        providerLinks.set(providerId, {
          url: redirect,
          providerName: providerName || null
        });
      });
    } catch (error) {
      continue;
    }
  }

  return providerLinks;
}

async function fetchWatchLinks(movieId, link) {
  if (!link) {
    return new Map();
  }

  const cacheKey = getCacheKey(movieId, link);
  if (WATCH_LINK_CACHE.has(cacheKey)) {
    return WATCH_LINK_CACHE.get(cacheKey);
  }

  try {
    const response = await axios.get(link, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7'
      },
      timeout: 10000
    });

    const providerLinks = extractProviderLinksFromHtml(response.data);
    WATCH_LINK_CACHE.set(cacheKey, providerLinks);
    return providerLinks;
  } catch (error) {
    console.error(
      `🎬 Doğrudan platform linkleri alınamadı (ID: ${movieId}):`,
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

  const directLinks = await fetchWatchLinks(movieId, regionInfo.link || '');

  const platformsWithLinks = platforms.map((platform) => {
    const providerId = platform?.provider_id || platform?.providerId;
    const matchingLink = providerId
      ? directLinks.get(providerId) || directLinks.get(String(providerId))
      : null;

    return {
      ...platform,
      direct_link: matchingLink?.url || '',
      direct_link_provider_name: matchingLink?.providerName || null
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
