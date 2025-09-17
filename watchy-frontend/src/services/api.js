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

export const getApiUrl = () => API_BASE_URL;

export const searchMovies = async (query) => {
  const res = await fetch(buildApiUrl(`/search/${encodeURIComponent(query)}`));
  if (!res.ok) throw new Error('Film arama başarısız');
  return await res.json();
};

export const searchMoviesByYear = async (year) => {
  const res = await fetch(buildApiUrl(`/search/year/${encodeURIComponent(year)}`));
  if (!res.ok) throw new Error('Yıla göre film arama başarısız');
  return await res.json();
};

export const getPlatforms = async (movieId) => {
  const res = await fetch(buildApiUrl(`/platforms/${encodeURIComponent(movieId)}`));
  if (!res.ok) throw new Error('Platform verisi alınamadı');
  return await res.json();
};

export const getWatchyScore = async (movieId) => {
  const res = await fetch(buildApiUrl(`/watchy-score/${encodeURIComponent(movieId)}`));
  if (!res.ok) throw new Error('Watchy puanı alınamadı');
  return await res.json();
};

export const searchMoviesByPeriod = async (from, to) => {
  const params = new URLSearchParams({ from: String(from), to: String(to) });
  const res = await fetch(buildApiUrl(`/search/period?${params.toString()}`));
  if (!res.ok) throw new Error('Döneme göre film arama başarısız');
  return await res.json();
};

export const getTopMoviesByDecade = async (start, end, limit = 3) => {
  const params = new URLSearchParams({ start: String(start), end: String(end), limit: String(limit) });
  const res = await fetch(buildApiUrl(`/movies/decade?${params.toString()}`));
  if (!res.ok) throw new Error('On yıllık döneme göre film araması başarısız');
  return await res.json();
};
