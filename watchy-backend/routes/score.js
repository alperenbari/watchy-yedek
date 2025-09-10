
const express = require('express');
const router = express.Router();
const WatchyScoreTMDB = require('../utils/WatchyScoreTMDB');

const TMDB_API_KEY = '612b8d18d354e3d2756cb9bf6abc219a';
const scoreCalculator = new WatchyScoreTMDB(TMDB_API_KEY);

router.get('/:movieId', async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const score = await scoreCalculator.getScore(movieId);
    if (score !== null) {
      res.json({ movieId, watchy_score: score });
    } else {
      res.status(404).json({ error: 'Puan bulunamadı.' });
    }
  } catch (err) {
    console.error('Watchy puanı hatası:', err.message);
    res.status(500).json({ error: 'Watchy puanı alınamadı.' });
  }
});

module.exports = router;
