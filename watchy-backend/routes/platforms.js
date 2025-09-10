
const express = require('express');
const router = express.Router();
const { getWatchProviders, getMovieTitle } = require('../services/tmdbService');
const { findOnOfficialYouTubeChannels } = require('../services/youtubeService');

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

  try {
    const title = await getMovieTitle(movieId);
    const youtubeResult = await findOnOfficialYouTubeChannels(title);
    if (youtubeResult) {
      platforms = [youtubeResult, ...platforms];
    }
  } catch (err) {
    console.error('🎥 YouTube kontrol hatası:', err.message);
  }

  res.json({ platforms, link });
});

module.exports = router;
