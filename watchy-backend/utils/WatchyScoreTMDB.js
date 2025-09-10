
const axios = require('axios');

class WatchyScoreTMDB {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async getScore(movieId) {
    try {
      const res = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: this.apiKey
        }
      });

      const tmdbScore = res.data.vote_average || null;
      return tmdbScore ? parseFloat(tmdbScore.toFixed(1)) : null;
    } catch (err) {
      console.error('WatchyScoreTMDB error:', err.message);
      return null;
    }
  }
}

module.exports = WatchyScoreTMDB;
