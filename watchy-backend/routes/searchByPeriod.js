const express = require('express');
const router = express.Router();
const { getCredits, getWatchProviders } = require('../services/tmdbService');
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

  const MAX_PAGES = 10;
  const MAX_RESULTS = 30;
  const MIN_VOTE_COUNT = 100;
  const seen = new Set();
  const results = [];
  const providerCache = new Map();

  if (!hasTmdbCredentials()) {
    console.error('🔴 TMDB kimlik bilgisi eksik:', missingCredentialsMessage());
    return res.status(500).json({ error: missingCredentialsMessage() });
  }

  try {
    for (let page = 1; page <= MAX_PAGES && results.length < MAX_RESULTS; page++) {
      console.log(`🌐 TMDB'den sayfa ${page} çekiliyor...`);
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        withTmdbAuth({
          params: {
            language: 'en-US',
            sort_by: 'vote_average.desc',
            include_adult: false,
            page,
            'primary_release_date.gte': `${from}-01-01`,
            'primary_release_date.lte': `${to}-12-31`,
            with_origin_country: 'US',
            'vote_count.gte': MIN_VOTE_COUNT
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

        if (seen.has(film.id)) {
          continue;
        }

        if (Number(film.vote_count ?? 0) < MIN_VOTE_COUNT) {
          continue;
        }

        let providers = providerCache.get(film.id);

        if (!providers) {
          try {
            providers = await getWatchProviders(film.id);
            providerCache.set(film.id, providers);
          } catch (error) {
            console.error(`📺 Platform bilgisi alınamadı (${film.id}):`, error?.message || error);
            providerCache.set(film.id, { platforms: [], link: '' });
            continue;
          }
        }

        const platforms = Array.isArray(providers?.platforms) ? providers.platforms : [];
        if (platforms.length === 0) {
          continue;
        }

        seen.add(film.id);

        const { director, cast } = await getCredits(film.id);
        results.push({
          movie_id: film.id,
          title: film.title,
          poster_path: film.poster_path,
          overview: film.overview,
          release_date: film.release_date,
          director,
          cast,
          vote_average: film.vote_average,
          vote_count: film.vote_count,
          platforms,
          watch_link: providers?.link || ''
        });

        if (results.length >= MAX_RESULTS) {
          break;
        }
      }

      if (response.data.total_pages <= page) break;
    }

    const filteredResults = results
      .filter((result) => {
        const releaseYear = Number(result.release_date?.slice(0, 4));
        return Number.isFinite(releaseYear) && releaseYear >= from && releaseYear <= to;
      })
      .slice(0, MAX_RESULTS);

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
