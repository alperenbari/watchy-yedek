
const express = require('express');
const router = express.Router();
const WatchyScoreTMDB = require('../utils/WatchyScoreTMDB');
const { missingCredentialsMessage } = require('../config/tmdb');

const scoreCalculator = new WatchyScoreTMDB();

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

    if (err.message === missingCredentialsMessage()) {
      return res.status(500).json({ error: err.message });
    }

    if (err.response?.status === 401) {
      return res.status(401).json({ error: 'TMDB kimlik doğrulaması başarısız. Lütfen API ayarlarınızı kontrol edin.' });
    }

    res.status(500).json({ error: 'Watchy puanı alınamadı.' });
  }
});

module.exports = router;
