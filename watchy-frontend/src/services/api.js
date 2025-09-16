export const searchMovies = async (query) => {
  const res = await fetch(`http://localhost:4000/api/search/${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error('Film arama başarısız');
  return await res.json();
};

export const getPlatforms = async (movieId) => {
  const res = await fetch(`http://localhost:4000/api/platforms/${movieId}`);
  if (!res.ok) throw new Error('Platform verisi alınamadı');
  return await res.json();
};

export const getWatchyScore = async (movieId) => {
  const res = await fetch(`http://localhost:4000/api/watchy-score/${movieId}`);
  if (!res.ok) throw new Error('Watchy puanı alınamadı');
  return await res.json();
};

// ✅ Tematik dönemlere göre film araması
export const searchMoviesByPeriod = async (from, to) => {
  const res = await fetch(`http://localhost:4000/api/search/period?from=${from}&to=${to}`);
  if (!res.ok) throw new Error('Döneme göre film arama başarısız');
  return await res.json();
};

export const getTopMoviesByDecade = async (start, end, limit = 3) => {
  const res = await fetch(
    `http://localhost:4000/api/movies/decade?start=${start}&end=${end}&limit=${limit}`
  );
  if (!res.ok) throw new Error('On yıllık döneme göre film araması başarısız');
  return await res.json();
};
