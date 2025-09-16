const fs = require('fs');
const path = require('path');

const envFiles = [
  path.resolve(__dirname, '../.env.local'),
  path.resolve(__dirname, '../.env'),
  path.resolve(__dirname, '../../.env')
];

const loadedEnvFiles = new Set();

function parseEnvLine(line) {
  if (!line) return null;

  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) {
    return null;
  }

  const withoutExport = trimmed.startsWith('export ')
    ? trimmed.slice('export '.length).trim()
    : trimmed;

  const equalsIndex = withoutExport.indexOf('=');
  if (equalsIndex === -1) {
    return null;
  }

  const key = withoutExport.slice(0, equalsIndex).trim();
  if (!key) {
    return null;
  }

  let value = withoutExport.slice(equalsIndex + 1).trim();

  const isWrapped = (wrapper) => value.startsWith(wrapper) && value.endsWith(wrapper);

  if (isWrapped('"') || isWrapped("'")) {
    value = value.slice(1, -1);
  } else {
    const commentIndex = value.indexOf(' #');
    if (commentIndex !== -1) {
      value = value.slice(0, commentIndex).trim();
    }
  }

  value = value
    .replace(/\\n/g, '\n')
    .replace(/\\r/g, '\r')
    .replace(/\\t/g, '\t');

  return { key, value };
}

function loadEnvFile(envPath) {
  if (loadedEnvFiles.has(envPath) || !fs.existsSync(envPath)) {
    return;
  }

  loadedEnvFiles.add(envPath);

  try {
    const contents = fs.readFileSync(envPath, 'utf8');
    const lines = contents.split(/\r?\n/);
    for (const line of lines) {
      const parsed = parseEnvLine(line);
      if (!parsed) continue;

      const { key, value } = parsed;
      if (!Object.prototype.hasOwnProperty.call(process.env, key)) {
        process.env[key] = value;
      }
    }
  } catch (error) {
    // dotenv previously operated in quiet mode, so suppress read errors.
  }
}

for (const envPath of envFiles) {
  loadEnvFile(envPath);
}

loadEnvFile(path.resolve(process.cwd(), '.env'));

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
