
const axios = require('axios');
const normalize = require('./normalize');
const {
  withTmdbAuth,
  hasTmdbCredentials,
  missingCredentialsMessage
} = require('../config/tmdb');

const JUSTWATCH_GRAPHQL_URL = 'https://apis.justwatch.com/graphql';
const JUSTWATCH_PLATFORM_WEB = 'WEB';
const JUSTWATCH_LANGUAGE = 'en';

function ensureCredentials() {
  if (!hasTmdbCredentials()) {
    throw new Error(missingCredentialsMessage());
  }
}

const CREDITS_CACHE = new Map();

function cloneMovieSearchResult(movie) {
  return {
    movie_id: movie.movie_id,
    title: movie.title,
    poster_path: movie.poster_path,
    overview: movie.overview,
    release_date: movie.release_date,
    director: movie.director,
    cast: Array.isArray(movie.cast) ? [...movie.cast] : []
  };
}

async function getCredits(movieId) {
  ensureCredentials();

  if (CREDITS_CACHE.has(movieId)) {
    return CREDITS_CACHE.get(movieId);
  }

  try {
    const res = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}/credits`,
      withTmdbAuth()
    );

    const crew = res.data.crew || [];
    const cast = res.data.cast || [];

    const director = crew.find(person => person.job === 'Director')?.name || null;
    const topCast = cast.slice(0, 5).map(actor => actor.name);
    const credits = { director, cast: topCast };

    CREDITS_CACHE.set(movieId, credits);
    return credits;
  } catch (err) {
    console.error(`🎬 Credits alınamadı (ID: ${movieId}):`, err.message);
    const fallback = { director: null, cast: [] };
    CREDITS_CACHE.set(movieId, fallback);
    return fallback;
  }
}

const SEARCH_LANGUAGES = ['tr-TR', 'en-US'];
const MAX_SEARCH_PAGES = 5;
const SEARCH_CACHE = new Map();
const SEARCH_CACHE_TTL_MS = 5 * 60 * 1000;

function getSearchCacheKey(query, normalizedQuery) {
  return `${query.toLowerCase()}::${normalizedQuery || ''}`;
}

function readSearchCache(key) {
  const entry = SEARCH_CACHE.get(key);
  if (!entry) {
    return null;
  }

  if (Date.now() - entry.timestamp > SEARCH_CACHE_TTL_MS) {
    SEARCH_CACHE.delete(key);
    return null;
  }

  return entry.data.map(cloneMovieSearchResult);
}

function writeSearchCache(key, value) {
  SEARCH_CACHE.set(key, {
    timestamp: Date.now(),
    data: value.map(cloneMovieSearchResult)
  });
}

async function searchMoviesWithCredits(rawQuery, normalizedQuery = normalize(rawQuery || '')) {
  ensureCredentials();

  const trimmedQuery = typeof rawQuery === 'string' ? rawQuery.trim() : '';
  const sanitizedQuery = trimmedQuery || normalizedQuery || '';

  if (!sanitizedQuery) {
    return [];
  }

  const cacheKey = getSearchCacheKey(sanitizedQuery, normalizedQuery);
  const cachedResults = readSearchCache(cacheKey);
  if (cachedResults) {
    return cachedResults;
  }

  const seen = new Set();
  const baseResults = [];

  for (const language of SEARCH_LANGUAGES) {
    for (let page = 1; page <= MAX_SEARCH_PAGES; page++) {
      const response = await axios.get(
        'https://api.themoviedb.org/3/search/movie',
        withTmdbAuth({
          params: {
            query: sanitizedQuery,
            language,
            include_adult: false,
            page
          }
        })
      );

      const movies = response.data?.results || [];

      for (const film of movies) {
        if (!film?.id || seen.has(film.id)) {
          continue;
        }

        const normalizedTitle = film.title ? normalize(film.title) : '';
        const normalizedOriginal = film.original_title ? normalize(film.original_title) : '';

        if (
          normalizedQuery &&
          !normalizedTitle.includes(normalizedQuery) &&
          !normalizedOriginal.includes(normalizedQuery)
        ) {
          continue;
        }

        seen.add(film.id);

        baseResults.push({
          movie_id: film.id,
          title: film.title,
          poster_path: film.poster_path,
          overview: film.overview,
          release_date: film.release_date
        });
      }

      const totalPages = response.data?.total_pages ?? 0;
      if (totalPages <= page) {
        break;
      }
    }
  }

  const resultsWithCredits = await Promise.all(
    baseResults.map(async (movie) => {
      const { director, cast } = await getCredits(movie.movie_id);

      return {
        ...movie,
        director,
        cast
      };
    })
  );

  writeSearchCache(cacheKey, resultsWithCredits);

  return resultsWithCredits.map(cloneMovieSearchResult);
}

async function getMoviesByDirector(personId, { limit = 40 } = {}) {
  ensureCredentials();

  const numericId = Number.parseInt(personId, 10);
  if (!Number.isFinite(numericId)) {
    throw new Error('Geçersiz yönetmen kimliği.');
  }

  const cappedLimit = Math.min(Math.max(limit, 1), 40);

  try {
    const [creditsResponse, personResponse] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/person/${numericId}/movie_credits`,
        withTmdbAuth({ params: { language: 'en-US' } })
      ),
      axios.get(
        `https://api.themoviedb.org/3/person/${numericId}`,
        withTmdbAuth({ params: { language: 'en-US' } })
      )
    ]);

    const allCrew = creditsResponse.data?.crew || [];
    const directorName = personResponse.data?.name || null;

    const directedCredits = allCrew.filter(
      (credit) => credit?.job === 'Director' && credit?.id
    );

    const uniqueCredits = [];
    const seen = new Set();
    for (const credit of directedCredits) {
      if (seen.has(credit.id)) {
        continue;
      }
      seen.add(credit.id);
      uniqueCredits.push(credit);
    }

    uniqueCredits.sort((a, b) => {
      const popularityDiff = (b?.popularity ?? 0) - (a?.popularity ?? 0);
      if (popularityDiff !== 0) {
        return popularityDiff;
      }

      const dateA = a?.release_date ? Date.parse(a.release_date) : 0;
      const dateB = b?.release_date ? Date.parse(b.release_date) : 0;
      return dateB - dateA;
    });

    const limitedCredits = uniqueCredits.slice(0, cappedLimit);

    const movies = await Promise.all(
      limitedCredits.map(async (credit) => {
        const { director, cast } = await getCredits(credit.id);

        return {
          movie_id: credit.id,
          title: credit.title,
          poster_path: credit.poster_path,
          overview: credit.overview,
          release_date: credit.release_date,
          director: director || directorName,
          cast
        };
      })
    );

    return movies;
  } catch (error) {
    console.error('🎬 Yönetmen filmografisi alınamadı:', error?.message || error);
    throw error;
  }
}

async function getMoviesByActor(personId, { limit = 40 } = {}) {
  ensureCredentials();

  const numericId = Number.parseInt(personId, 10);
  if (!Number.isFinite(numericId)) {
    throw new Error('Geçersiz oyuncu kimliği.');
  }

  const cappedLimit = Math.min(Math.max(limit, 1), 40);

  try {
    const [creditsResponse, personResponse] = await Promise.all([
      axios.get(
        `https://api.themoviedb.org/3/person/${numericId}/movie_credits`,
        withTmdbAuth({ params: { language: 'en-US' } })
      ),
      axios.get(
        `https://api.themoviedb.org/3/person/${numericId}`,
        withTmdbAuth({ params: { language: 'en-US' } })
      )
    ]);

    const allCast = creditsResponse.data?.cast || [];
    const actorName = personResponse.data?.name || null;

    const uniqueCredits = [];
    const seen = new Set();

    for (const credit of allCast) {
      if (!credit?.id || seen.has(credit.id)) {
        continue;
      }

      seen.add(credit.id);
      uniqueCredits.push(credit);
    }

    uniqueCredits.sort((a, b) => {
      const popularityDiff = (b?.popularity ?? 0) - (a?.popularity ?? 0);
      if (popularityDiff !== 0) {
        return popularityDiff;
      }

      const dateA = a?.release_date ? Date.parse(a.release_date) : 0;
      const dateB = b?.release_date ? Date.parse(b.release_date) : 0;
      return dateB - dateA;
    });

    const limitedCredits = uniqueCredits.slice(0, cappedLimit);

    const movies = await Promise.all(
      limitedCredits.map(async (credit) => {
        const { director, cast } = await getCredits(credit.id);

        return {
          movie_id: credit.id,
          title: credit.title,
          poster_path: credit.poster_path,
          overview: credit.overview,
          release_date: credit.release_date,
          director,
          cast,
          character: credit.character || null,
          actor: actorName
        };
      })
    );

    return movies;
  } catch (error) {
    console.error('🎬 Oyuncu filmografisi alınamadı:', error?.message || error);
    throw error;
  }
}

async function getPersonDetails(personId) {
  ensureCredentials();

  const numericId = Number.parseInt(personId, 10);

  if (!Number.isFinite(numericId)) {
    throw new Error('Geçersiz kişi kimliği.');
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/person/${numericId}`,
      withTmdbAuth({ params: { language: 'en-US' } })
    );

    const data = response.data || {};

    return {
      id: data.id ?? numericId,
      name: data.name || null,
      profile_path: data.profile_path || null,
      known_for_department: data.known_for_department || null
    };
  } catch (error) {
    console.error('🎬 Kişi bilgisi alınamadı:', error?.message || error);
    throw error;
  }
}

const REGION_TURKEY = 'TR';
const CATEGORY_PRIORITY = ['flatrate', 'free', 'ads', 'rent', 'buy'];

const WATCH_LINK_CACHE = new Map();
const IMDB_ID_CACHE = new Map();
const JUSTWATCH_ID_CACHE = new Map();
const MOVIE_DETAILS_CACHE = new Map();

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

async function getMovieDetails(movieId) {
  if (MOVIE_DETAILS_CACHE.has(movieId)) {
    return MOVIE_DETAILS_CACHE.get(movieId);
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}`,
      withTmdbAuth({ params: { language: 'en-US' } })
    );

    const details = response.data || null;
    MOVIE_DETAILS_CACHE.set(movieId, details);
    return details;
  } catch (error) {
    console.error(`🎬 Film bilgisi alınamadı (ID: ${movieId}):`, error.message);
    MOVIE_DETAILS_CACHE.set(movieId, null);
    return null;
  }
}

async function searchJustWatchTitles(query) {
  const variables = {
    country: REGION_TURKEY,
    language: JUSTWATCH_LANGUAGE,
    query
  };

  const graphqlQuery = `
    query Search($country: Country!, $language: Language!, $query: String!) {
      popularTitles(
        country: $country,
        first: 25,
        filter: { searchQuery: $query, objectTypes: [MOVIE] }
      ) {
        edges {
          node {
            id
            __typename
            content(country: $country, language: $language) {
              title
              externalIds {
                imdbId
                tmdbId
              }
            }
          }
        }
      }
    }
  `;

  const response = await axios.post(JUSTWATCH_GRAPHQL_URL, {
    query: graphqlQuery,
    variables
  });

  return response.data?.data?.popularTitles?.edges || [];
}

async function resolveJustWatchId(movieId) {
  if (JUSTWATCH_ID_CACHE.has(movieId)) {
    return JUSTWATCH_ID_CACHE.get(movieId);
  }

  const [movieDetails, imdbId] = await Promise.all([
    getMovieDetails(movieId),
    getImdbId(movieId)
  ]);

  const candidates = new Set();
  if (movieDetails?.title) {
    candidates.add(movieDetails.title);
  }
  if (movieDetails?.original_title) {
    candidates.add(movieDetails.original_title);
  }
  if (imdbId) {
    candidates.add(String(imdbId));
  }

  if (!candidates.size) {
    JUSTWATCH_ID_CACHE.set(movieId, null);
    return null;
  }

  for (const query of candidates) {
    const trimmedQuery = typeof query === 'string' ? query.trim() : '';
    if (!trimmedQuery) continue;

    try {
      const edges = await searchJustWatchTitles(trimmedQuery);
      if (!Array.isArray(edges) || !edges.length) {
        continue;
      }

      const targetTmdbId = String(movieId);
      const targetImdbId = imdbId ? String(imdbId) : null;

      const match = edges.find((edge) => {
        const ids = edge?.node?.content?.externalIds || {};
        const candidateTmdbId = ids?.tmdbId ? String(ids.tmdbId) : null;
        const candidateImdbId = ids?.imdbId ? String(ids.imdbId) : null;

        return (
          (candidateTmdbId && candidateTmdbId === targetTmdbId) ||
          (targetImdbId && candidateImdbId && candidateImdbId === targetImdbId)
        );
      });

      if (match?.node?.id) {
        JUSTWATCH_ID_CACHE.set(movieId, match.node.id);
        return match.node.id;
      }
    } catch (error) {
      console.error(
        `🎬 JustWatch araması başarısız (ID: ${movieId}, sorgu: ${trimmedQuery}):`,
        error.message
      );
    }
  }

  JUSTWATCH_ID_CACHE.set(movieId, null);
  return null;
}

async function fetchWatchLinks(movieId) {
  const cacheKey = getCacheKey(movieId, 'justwatch');
  if (WATCH_LINK_CACHE.has(cacheKey)) {
    return WATCH_LINK_CACHE.get(cacheKey);
  }

  const justWatchId = await resolveJustWatchId(movieId);

  if (!justWatchId) {
    WATCH_LINK_CACHE.set(cacheKey, new Map());
    return new Map();
  }

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

    const node = response.data?.data?.node || {};
    const offers = Array.isArray(node?.offers) ? node.offers : [];

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
  getWatchProviders,
  getMoviesByDirector,
  getMoviesByActor,
  getPersonDetails
};
