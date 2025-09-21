const express = require('express');

const router = express.Router();

const { getMoviesByDirector } = require('../services/tmdbService');
const { missingCredentialsMessage } = require('../config/tmdb');

router.get('/:directorId', async (req, res) => {
  const { directorId: rawDirectorId } = req.params;

  const directorId = Number.parseInt(rawDirectorId, 10);
  if (!Number.isFinite(directorId)) {
    return res.status(400).json({ error: 'Geçerli bir yönetmen kimliği sağlamalısınız.' });
  }

  try {
    const movies = await getMoviesByDirector(directorId);
    return res.json(movies);
  } catch (error) {
    const status =
      error.response?.status ||
      (error.message === missingCredentialsMessage() ? 500 : error.status) ||
      500;
    const details = error.response?.data?.status_message || error.message;

    console.error('🔴 Yönetmen filmleri alınamadı:', details);

    if (error.message === missingCredentialsMessage()) {
      return res.status(500).json({ error: error.message });
    }

    if (status === 404) {
      return res.status(404).json({ error: 'Yönetmen bulunamadı.' });
    }

    if (status === 401) {
      return res
        .status(401)
        .json({ error: 'TMDB kimlik doğrulaması başarısız. Lütfen API ayarlarınızı kontrol edin.' });
    }

    if (status === 400) {
      return res.status(400).json({ error: 'Yönetmen filmografisi alınamadı.' });
    }

    return res.status(500).json({ error: 'Yönetmen filmleri alınırken bir hata oluştu.' });
  }
});

module.exports = router;
