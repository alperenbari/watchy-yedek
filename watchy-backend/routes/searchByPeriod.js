const express = require('express');
const router = express.Router();
const { getCredits } = require('../services/tmdbService');
const axios = require('axios');
const {
  withTmdbAuth,
  hasTmdbCredentials,
  missingCredentialsMessage
} = require('../config/tmdb');

router.get('/', async (req, res) => {
  const from = parseInt(req.query.from);
  const to = parseInt(req.query.to);

  console.log("📢 searchByPeriod.js yüklendi.");

  if (isNaN(from) || isNaN(to) || from > to) {
    console.log('⛔ Geçersiz yıl aralığı:', { from, to });
    return res.status(400).json({ error: 'Geçersiz yıl aralığı.' });
  }

  console.log(`🔍 Film aranıyor: ${from} - ${to} arası`);

  const MAX_PAGES = 3;
  const seen = new Set();
  const results = [];

  if (!hasTmdbCredentials()) {
    console.error('🔴 TMDB kimlik bilgisi eksik:', missingCredentialsMessage());
    return res.status(500).json({ error: missingCredentialsMessage() });
  }

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      console.log(`🌐 TMDB'den sayfa ${page} çekiliyor...`);
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        withTmdbAuth({
          params: {
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            page,
            'primary_release_date.gte': `${from}-01-01`,
            'primary_release_date.lte': `${to}-12-31`,
            with_origin_country: 'US'
          }
        })
      );

      const movies = response.data.results || [];
      console.log(`📦 Sayfa ${page} — ${movies.length} film bulundu`);

      for (const film of movies) {
        const year = Number(film.release_date?.slice(0, 4));
        if (!Number.isFinite(year) || year < from || year > to) {
          continue;
        }

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

    const filteredResults = results.filter((result) => {
      const releaseYear = Number(result.release_date?.slice(0, 4));
      return Number.isFinite(releaseYear) && releaseYear >= from && releaseYear <= to;
    });

    console.log(`🎯 Toplam sonuç: ${filteredResults.length}`);
    res.json(filteredResults);
  } catch (err) {
    const status = err.response?.status;
    const details = err.response?.data?.status_message || err.message;

    console.error('🔴 Dönem araması hatası:', details);

    if (err.message === missingCredentialsMessage()) {
      return res.status(500).json({ error: err.message });
    }

    if (status === 401) {
      return res.status(401).json({ error: 'TMDB kimlik doğrulaması başarısız. Lütfen API ayarlarınızı kontrol edin.' });
    }

    res.status(500).json({ error: 'Dönem araması sırasında hata oluştu.' });
  }
});

module.exports = router;
