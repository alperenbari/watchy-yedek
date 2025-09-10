const express = require('express');
const cors = require('cors');

const searchRoute = require('./routes/search');
const searchByYearRoute = require('./routes/searchByYear');
const searchByPeriodRoute = require('./routes/searchByPeriod');
const platformsRoute = require('./routes/platforms');
const scoreRoute = require('./routes/score');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());

// API rotalarını tanımla
app.use('/api/search', searchRoute);              // Örn: /api/search/:query
app.use('/api/search/year', searchByYearRoute);   // Örn: /api/search/year/:year
app.use('/api/search/period', searchByPeriodRoute);
app.use('/api/platforms', platformsRoute);        // Örn: /api/platforms/:movieId
app.use('/api/watchy-score', scoreRoute);         // Örn: /api/watchy-score/:movieId

// Sunucuyu başlat
app.listen(PORT, () => {
  console.log(`✅ Backend çalışıyor: http://localhost:${PORT}`);
});
