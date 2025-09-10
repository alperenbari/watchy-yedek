
const express = require('express');
const router = express.Router();
const { getCredits } = require('../services/tmdbService');
const axios = require('axios');

const TMDB_API_KEY = '612b8d18d354e3d2756cb9bf6abc219a';

router.get('/:year', async (req, res) => {
  const year = req.params.year;
  const MAX_PAGES = 5;
  const seen = new Set();
  const results = [];

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: TMDB_API_KEY,
          language: 'tr-TR',
          sort_by: 'popularity.desc',
          include_adult: false,
          with_origin_country: 'TR',
          page,
          primary_release_year: year
        }
      });

      const movies = response.data.results || [];

      for (const film of movies) {
        if (!seen.has(film.id)) {
          seen.add(film.id);
          const { director, cast } = await getCredits(film.id);
          results.push({
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

    res.json(results);
  } catch (err) {
    console.error('🔴 Yıl bazlı arama hatası:', err.message);
    res.status(500).json({ error: 'Yıl bazlı arama sırasında hata oluştu.' });
  }
});

module.exports = router;
