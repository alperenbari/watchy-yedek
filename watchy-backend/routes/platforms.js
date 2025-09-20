const express = require('express');
const router = express.Router();
const { getWatchProviders } = require('../services/tmdbService');

router.get('/:movieId', async (req, res) => {
  const movieId = req.params.movieId;
  let platforms = [];
  let link = '';

  try {
    const result = await getWatchProviders(movieId);
    platforms = result.platforms;
    link = result.link;
  } catch (err) {
    console.error('TMDB platform verisi hatası:', err.message);
  }

  res.json({ platforms, link });
});

module.exports = router;
