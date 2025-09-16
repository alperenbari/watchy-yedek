const API_ROOT_PATH = '/api';
const rawBaseUrl = process.env.REACT_APP_API_BASE_URL ?? '';

export const API_BASE_URL = rawBaseUrl.trim().replace(/\/+$/, '');

const stripTrailingSlash = (value) => value.replace(/\/+$/, '');
const ensureLeadingSlash = (value) => (value.startsWith('/') ? value : `/${value}`);
const removeLeadingSlash = (value) => value.replace(/^\/+/, '');

const splitPathSearchHash = (input) => {
  const hashIndex = input.indexOf('#');
  let path = input;
  let search = '';
  let hash = '';

  if (hashIndex !== -1) {
    hash = input.slice(hashIndex);
    path = input.slice(0, hashIndex);
  }

  const questionInPath = path.indexOf('?');
  if (questionInPath !== -1) {
    search = path.slice(questionInPath);
    path = path.slice(0, questionInPath);
  }

  return { path, search, hash };
};

const buildApiPath = (path = '') => {
  const normalized = path.toString().trim();
  if (!normalized) {
    return API_ROOT_PATH;
  }

  const withLeadingSlash = ensureLeadingSlash(normalized);
  if (withLeadingSlash === API_ROOT_PATH || withLeadingSlash.startsWith(`${API_ROOT_PATH}/`)) {
    return withLeadingSlash;
  }

  return `${API_ROOT_PATH}${withLeadingSlash}`;
};

/**
 * Resolves the requested API path so it works with both the CRA dev proxy (no base URL)
 * and any configured backend origin (with or without an "/api" suffix in its pathname).
 */
const resolveWithBase = (apiPath) => {
  if (!API_BASE_URL) {
    return apiPath;
  }

  const { path, search, hash } = splitPathSearchHash(apiPath);
  const suffixAfterApi = removeLeadingSlash(
    path.startsWith(API_ROOT_PATH) ? path.slice(API_ROOT_PATH.length) : path
  );

  try {
    const baseUrl = new URL(API_BASE_URL);
    const basePath = stripTrailingSlash(baseUrl.pathname || '');
    const baseSegments = basePath.split('/').filter(Boolean);
    const includesApiSegment = baseSegments.includes('api');

    let finalPath;

    if (!basePath || basePath === '/') {
      finalPath = path;
    } else if (path === API_ROOT_PATH) {
      finalPath = includesApiSegment ? basePath : `${basePath}${API_ROOT_PATH}`;
    } else if (path.startsWith(`${API_ROOT_PATH}/`)) {
      finalPath = includesApiSegment
        ? `${basePath}/${suffixAfterApi}`
        : `${basePath}${path}`;
    } else {
      finalPath = `${basePath}${ensureLeadingSlash(path)}`;
    }

    baseUrl.pathname = finalPath.replace(/\/+/g, '/');
    baseUrl.search = search;
    baseUrl.hash = hash;
    return baseUrl.toString();
  } catch (error) {
    const trimmedBase = stripTrailingSlash(API_BASE_URL);
    const baseSegments = trimmedBase.split('/').filter(Boolean);
    const includesApiSegment = baseSegments.includes('api');

    if (includesApiSegment) {
      const joiner = suffixAfterApi ? `/${suffixAfterApi}` : '';
      return `${trimmedBase}${joiner}${search}${hash}`;
    }

    const joiner = path.startsWith('/') ? path : `/${path}`;
    return `${trimmedBase}${joiner}${search}${hash}`;
  }
};

export const getApiUrl = (path = '') => resolveWithBase(buildApiPath(path));

export const searchMovies = async (query) => {
  const res = await fetch(getApiUrl(`search/${encodeURIComponent(query)}`));
  if (!res.ok) throw new Error('Film arama başarısız');
  return await res.json();
};

export const getPlatforms = async (movieId) => {
  const res = await fetch(getApiUrl(`platforms/${movieId}`));
  if (!res.ok) throw new Error('Platform verisi alınamadı');
  return await res.json();
};

export const getWatchyScore = async (movieId) => {
  const res = await fetch(getApiUrl(`watchy-score/${movieId}`));
  if (!res.ok) throw new Error('Watchy puanı alınamadı');
  return await res.json();
};

// ✅ Tematik dönemlere göre film araması
export const searchMoviesByPeriod = async (from, to) => {
  const res = await fetch(getApiUrl(`search/period?from=${from}&to=${to}`));
  if (!res.ok) throw new Error('Döneme göre film arama başarısız');
  return await res.json();
};

export const getTopMoviesByDecade = async (start, end, limit = 3) => {
  const res = await fetch(
    getApiUrl(`movies/decade?start=${start}&end=${end}&limit=${limit}`)
  );
  if (!res.ok) throw new Error('On yıllık döneme göre film araması başarısız');
  return await res.json();
};
