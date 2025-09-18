const express = require('express');
const axios = require('axios');
const {
  withTmdbAuth,
  hasTmdbCredentials,
  missingCredentialsMessage
} = require('../config/tmdb');
const { getFallbackMovies } = require('../services/fallbackDecadeMovies');

const router = express.Router();

const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w342';
const DEFAULT_LIMIT = 3;

function parseYear(value) {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

router.get('/decade', async (req, res) => {
  const startParam = req.query.start;
  const endParam = req.query.end;
  const limitParam = req.query.limit;

  const startYear = parseYear(startParam);
  const endYear = parseYear(endParam) ?? (startYear != null ? startYear + 9 : null);
  const parsedLimit = parseYear(limitParam) ?? DEFAULT_LIMIT;
  const limit = Math.min(Math.max(parsedLimit, 1), 20);

  if (startYear == null || endYear == null || startYear > endYear) {
    return res.status(400).json({ error: 'Geçerli bir başlangıç ve bitiş yılı sağlamalısınız.' });
  }

  const movies = [];
  const seen = new Set();
  const maxPages = 5;

  try {
    if (!hasTmdbCredentials()) {
      const fallback = getFallbackMovies(startYear, endYear, limit);
      if (fallback.length === 0) {
        console.warn('⚠️  TMDB kimlik bilgileri bulunamadı. Fallback dönem filmleri kullanılıyor.');
      }
      return res.json(fallback);
    }

    for (let page = 1; page <= maxPages && movies.length < limit; page++) {
      const response = await axios.get(
        'https://api.themoviedb.org/3/discover/movie',
        withTmdbAuth({
          params: {
            language: 'en-US',
            sort_by: 'popularity.desc',
            include_adult: false,
            page,
            'primary_release_date.gte': `${startYear}-01-01`,
            'primary_release_date.lte': `${endYear}-12-31`,
            with_origin_country: 'US'
          }
        })
      );

      const results = response.data?.results ?? [];
      for (const film of results) {
        if (movies.length >= limit) {
          break;
        }

        if (!film?.id || !film?.title || seen.has(film.id)) {
          continue;
        }

        const releaseYear = parseYear(film.release_date?.slice(0, 4));
        if (releaseYear == null || releaseYear < startYear || releaseYear > endYear) {
          continue;
        }

        seen.add(film.id);
        movies.push({
          movie_id: film.id,
          title: film.title,
          posterUrl: film.poster_path ? `${IMAGE_BASE_URL}${film.poster_path}` : null,
          overview: film.overview ?? '',
          release_year: releaseYear
        });
      }

      const totalPages = response.data?.total_pages ?? 0;
      if (totalPages <= page) {
        break;
      }
    }

    res.json(movies.slice(0, limit));
  } catch (error) {
    const status = error.response?.status;
    const message = error.response?.data?.status_message || error.message;

    console.error('🎬 On yıllık dilim filmleri alınamadı:', message);

    const fallbackMovies = getFallbackMovies(startYear, endYear, limit);
    if (fallbackMovies.length > 0) {
      const reason =
        message === missingCredentialsMessage()
          ? 'TMDB kimlik bilgileri eksik.'
          : status === 401
          ? 'TMDB kimlik doğrulaması başarısız.'
          : 'TMDB isteği başarısız oldu.';
      console.warn(`⚠️  ${reason} Yerel dönem filmleri kullanılıyor.`);
      return res.json(fallbackMovies);
    }

    if (message === missingCredentialsMessage()) {
      return res.status(500).json({ error: message });
    }

    if (status === 401) {
      return res
        .status(401)
        .json({ error: 'TMDB kimlik doğrulaması başarısız. Lütfen API ayarlarınızı kontrol edin.' });
    }

    res.status(500).json({ error: 'On yıllık döneme ait filmler alınırken hata oluştu.' });
  }
});

module.exports = router;
