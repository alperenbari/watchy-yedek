
const express = require('express');
const router = express.Router();
const { getCredits } = require('../services/tmdbService');
const axios = require('axios');
const {
  withTmdbAuth,
  hasTmdbCredentials,
  missingCredentialsMessage
} = require('../config/tmdb');

router.get('/:year', async (req, res) => {
  const year = req.params.year;
  const MAX_PAGES = 5;
  const seen = new Set();
  const results = [];

  if (!hasTmdbCredentials()) {
    console.error('🔴 TMDB kimlik bilgisi eksik:', missingCredentialsMessage());
    return res.status(500).json({ error: missingCredentialsMessage() });
  }

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        withTmdbAuth({
          params: {
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            with_origin_country: 'US',
            page,
            primary_release_year: year
          }
        })
      );

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
    const status = err.response?.status;
    const details = err.response?.data?.status_message || err.message;

    console.error('🔴 Yıl bazlı arama hatası:', details);

    if (err.message === missingCredentialsMessage()) {
      return res.status(500).json({ error: err.message });
    }

    if (status === 401) {
      return res.status(401).json({ error: 'TMDB kimlik doğrulaması başarısız. Lütfen API ayarlarınızı kontrol edin.' });
    }

    res.status(500).json({ error: 'Yıl bazlı arama sırasında hata oluştu.' });
  }
});

module.exports = router;
