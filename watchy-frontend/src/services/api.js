
  if (!res.ok) throw new Error('Film arama başarısız');
  return await res.json();
};

export const getPlatforms = async (movieId) => {

  if (!res.ok) throw new Error('Platform verisi alınamadı');
  return await res.json();
};

export const getWatchyScore = async (movieId) => {

  if (!res.ok) throw new Error('Watchy puanı alınamadı');
  return await res.json();
};

// ✅ Tematik dönemlere göre film araması
export const searchMoviesByPeriod = async (from, to) => {

  if (!res.ok) throw new Error('Döneme göre film arama başarısız');
  return await res.json();
};

export const getTopMoviesByDecade = async (start, end, limit = 3) => {
  const res = await fetch(
  );
  if (!res.ok) throw new Error('On yıllık döneme göre film araması başarısız');
  return await res.json();
};
