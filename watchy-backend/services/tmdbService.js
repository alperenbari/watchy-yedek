
const axios = require('axios');
const normalize = require('./normalize');

const TMDB_API_KEY = '612b8d18d354e3d2756cb9bf6abc219a';

async function getCredits(movieId) {
  try {
    const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
      params: { api_key: TMDB_API_KEY }
    });

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
  const MAX_PAGES = 30;
  const seen = new Set();
  const filtered = [];
  const sortOptions = ['popularity.desc', 'release_date.desc'];

  for (const sort of sortOptions) {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: TMDB_API_KEY,
          with_origin_country: 'TR',
          language: 'tr-TR',
          include_adult: false,
          sort_by: sort,
          page
        }
      });

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

async function getWatchProviders(movieId) {
  const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}/watch/providers`, {
    params: { api_key: TMDB_API_KEY }
  });
  return {
    platforms: res.data?.results?.TR?.flatrate || [],
    link: res.data?.results?.TR?.link || ''
  };
}

async function getMovieTitle(movieId) {
  const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
    params: { api_key: TMDB_API_KEY, language: 'tr-TR' }
  });
  return res.data.title;
}



module.exports = {
  searchMoviesWithCredits,
  getCredits,
  getWatchProviders,
  getMovieTitle
};
