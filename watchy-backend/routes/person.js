const express = require('express');
const { getPersonDetails } = require('../services/tmdbService');

const router = express.Router();

router.get('/:personId', async (req, res) => {
  const { personId: rawPersonId } = req.params;
  const personId = Number.parseInt(rawPersonId, 10);

  if (!Number.isFinite(personId)) {
    res.status(400).json({ error: 'Geçersiz kişi kimliği.' });
    return;
  }

  try {
    const details = await getPersonDetails(personId);
    res.json(details || {});
  } catch (error) {
    console.error('🎬 Kişi bilgisi alınamadı:', error?.message || error);
    res.status(500).json({ error: 'Kişi bilgisi alınamadı.' });
  }
});

module.exports = router;
