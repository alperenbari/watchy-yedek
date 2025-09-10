const express = require('express');
const router = express.Router();
const { getCredits } = require('../services/tmdbService');
const axios = require('axios');

const TMDB_API_KEY = '612b8d18d354e3d2756cb9bf6abc219a';

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

  try {
    for (let page = 1; page <= MAX_PAGES; page++) {
      console.log(`🌐 TMDB'den sayfa ${page} çekiliyor...`);
      const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
        params: {
          api_key: TMDB_API_KEY,
          language: 'tr-TR',
          sort_by: 'popularity.desc',
          include_adult: false,
          page,
          primary_release_date_gte: `${from}-01-01`,
          primary_release_date_lte: `${to}-12-31`,
          with_origin_country: 'TR'
        }
      });

      const movies = response.data.results || [];
      console.log(`📦 Sayfa ${page} — ${movies.length} film bulundu`);

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
          console.log(`✅ Film eklendi: ${film.title}`);
        }
      }

      if (response.data.total_pages <= page) break;
    }

    console.log(`🎯 Toplam sonuç: ${results.length}`);
    res.json(results);
  } catch (err) {
    console.error('🔴 Dönem araması hatası:', err.message);
    res.status(500).json({ error: 'Dönem araması sırasında hata oluştu.' });
  }
});

module.exports = router;
