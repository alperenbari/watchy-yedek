
const axios = require('axios');
const {
  withTmdbAuth,
  hasTmdbCredentials,
  missingCredentialsMessage
} = require('../config/tmdb');

class WatchyScoreTMDB {
  async getScore(movieId) {
    if (!hasTmdbCredentials()) {
      throw new Error(missingCredentialsMessage());
    }

    try {
      const res = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}`,
        withTmdbAuth()
      );

      const tmdbScore = res.data.vote_average || null;
      return tmdbScore ? parseFloat(tmdbScore.toFixed(1)) : null;
    } catch (err) {
      console.error('WatchyScoreTMDB error:', err.message);
      return null;
    }
  }
}

module.exports = WatchyScoreTMDB;
