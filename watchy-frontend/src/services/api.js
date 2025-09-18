const DEFAULT_API_BASE = 'http://localhost:4000/api';

const sanitizeBaseUrl = (url) => {
  if (!url) return DEFAULT_API_BASE;
  const trimmed = url.trim();
  const withoutTrailingSlash = trimmed.replace(/\/+$/, '');
  return withoutTrailingSlash || DEFAULT_API_BASE;
};

const API_BASE_URL = sanitizeBaseUrl(process.env.REACT_APP_API_URL);

const buildApiUrl = (path) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

const fetchJson = async (path, errorMessage) => {
  const response = await fetch(buildApiUrl(path));

  if (!response.ok) {
    throw new Error(errorMessage);
  }

  return response.json();
};

export const getApiUrl = () => API_BASE_URL;

export const searchMovies = (query) =>
  fetchJson(`/search/${encodeURIComponent(query)}`, 'Film arama başarısız');

export const searchMoviesByYear = (year) =>
  fetchJson(`/search/year/${encodeURIComponent(year)}`, 'Yıla göre film arama başarısız');

export const getPlatforms = (movieId) =>
  fetchJson(`/platforms/${encodeURIComponent(movieId)}`, 'Platform verisi alınamadı');

export const getWatchyScore = (movieId) =>
  fetchJson(`/watchy-score/${encodeURIComponent(movieId)}`, 'Watchy puanı alınamadı');

export const searchMoviesByPeriod = (from, to) => {
  const params = new URLSearchParams({ from: String(from), to: String(to) });
  return fetchJson(
    `/search/period?${params.toString()}`,
    'Döneme göre film arama başarısız'
  );
};

export const getTopMoviesByDecade = (start, end, limit = 3) => {
  const params = new URLSearchParams({
    start: String(start),
    end: String(end),
    limit: String(limit)
  });

  return fetchJson(
    `/movies/decade?${params.toString()}`,
    'On yıllık döneme göre film araması başarısız'
  );
};
