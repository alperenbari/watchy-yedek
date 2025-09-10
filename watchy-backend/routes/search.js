
const express = require('express');
const router = express.Router();
const { searchMoviesWithCredits } = require('../services/tmdbService');
const normalize = require('../services/normalize');

router.get('/:query', async (req, res) => {
  const rawQuery = req.params.query;
  const query = normalize(rawQuery);

  try {
    const results = await searchMoviesWithCredits(query);
    res.json(results);
  } catch (err) {
    console.error('🔴 Discover arama hatası:', err.message);
    res.status(500).json({ error: 'Film aranırken hata oluştu.' });
  }
});

module.exports = router;
