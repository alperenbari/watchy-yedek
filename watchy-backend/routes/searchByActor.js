const express = require('express');
const { getMoviesByActor } = require('../services/tmdbService');

const router = express.Router();

router.get('/:actorId', async (req, res) => {
  const { actorId: rawActorId } = req.params;
  const actorId = Number.parseInt(rawActorId, 10);

  if (!Number.isFinite(actorId)) {
    res.status(400).json({ error: 'Geçersiz oyuncu kimliği.' });
    return;
  }

  try {
    const movies = await getMoviesByActor(actorId);
    res.json(Array.isArray(movies) ? movies : []);
  } catch (error) {
    console.error('🎬 Oyuncuya göre arama hatası:', error?.message || error);
    res.status(500).json({ error: 'Oyuncu filmografisi alınamadı.' });
  }
});

module.exports = router;
