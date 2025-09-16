const path = require('path');
const dotenv = require('dotenv');

const envFiles = [
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env')
];

for (const envPath of envFiles) {
  dotenv.config({ path: envPath, override: false, quiet: true });
}

dotenv.config({ override: false, quiet: true });

const clean = (value) => (value || '').trim();

const TMDB_API_KEY = clean(process.env.TMDB_API_KEY || process.env.TMDB_V3_API_KEY);
const TMDB_ACCESS_TOKEN = clean(process.env.TMDB_ACCESS_TOKEN || process.env.TMDB_BEARER_TOKEN);

function hasTmdbCredentials() {
  return Boolean(TMDB_API_KEY || TMDB_ACCESS_TOKEN);
}

function withTmdbAuth(config = {}) {
  const finalConfig = {
    ...config,
    params: { ...(config.params || {}) },
    headers: { ...(config.headers || {}) }
  };

  if (TMDB_API_KEY) {
    finalConfig.params.api_key = TMDB_API_KEY;
  }

  if (TMDB_ACCESS_TOKEN) {
    finalConfig.headers.Authorization = `Bearer ${TMDB_ACCESS_TOKEN}`;
  }

  if (Object.keys(finalConfig.params).length === 0) {
    delete finalConfig.params;
  }

  if (Object.keys(finalConfig.headers).length === 0) {
    delete finalConfig.headers;
  }

  return finalConfig;
}

function missingCredentialsMessage() {
  return 'TMDB API anahtarı veya erişim token\'ı tanımlı değil. Lütfen .env dosyasında TMDB_API_KEY veya TMDB_ACCESS_TOKEN değerlerini ayarlayın.';
}

module.exports = {
  TMDB_API_KEY,
  TMDB_ACCESS_TOKEN,
  hasTmdbCredentials,
  withTmdbAuth,
  missingCredentialsMessage
};
