
const express = require('express');
const router = express.Router();
const { searchMoviesWithCredits } = require('../services/tmdbService');
const normalize = require('../services/normalize');
const { missingCredentialsMessage } = require('../config/tmdb');

router.get('/:query', async (req, res) => {
  const rawQuery = req.params.query;
  const query = normalize(rawQuery);

  try {
    const results = await searchMoviesWithCredits(rawQuery, query);
    res.json(results);
  } catch (err) {
    const status = err.response?.status || (err.message === missingCredentialsMessage() ? 500 : err.status) || 500;
    const details = err.response?.data?.status_message || err.message;

    console.error('🔴 Discover arama hatası:', details);

    if (err.message === missingCredentialsMessage()) {
      return res.status(500).json({ error: err.message });
    }

    if (status === 401) {
      return res.status(401).json({ error: 'TMDB kimlik doğrulaması başarısız. Lütfen API anahtarınızı/tokenınızı kontrol edin.' });
    }

    res.status(500).json({ error: 'Film aranırken hata oluştu.' });
  }
});

module.exports = router;
