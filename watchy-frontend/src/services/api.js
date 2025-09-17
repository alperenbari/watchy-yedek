const API_ROOT_PATH = '/api';

export const API_BASE_URL = (process.env.REACT_APP_API_BASE_URL ?? '').replace(/\/$/, '');

const normalizePath = (path = '') => {
  const trimmed = path.trim().replace(/^\/+/, '');
  return trimmed ? `${API_ROOT_PATH}/${trimmed}` : API_ROOT_PATH;
};

export const getApiUrl = (path = '') => {
  const apiPath = normalizePath(path);
  return API_BASE_URL ? `${API_BASE_URL}${apiPath}` : apiPath;
};

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
