// youtubeCache.js - hafıza içi basit TTL destekli cache

const youtubeCache = new Map();

// title: string, data: object|null, ttlMs: number (default: 24 saat)
function setToCache(title, data, ttlMs = 86400000) {
  youtubeCache.set(title, { data, expires: Date.now() + ttlMs });
}

function getFromCache(title) {
  const cached = youtubeCache.get(title);
  if (!cached) return null;

  if (Date.now() > cached.expires) {
    youtubeCache.delete(title);
    return null;
  }

  return cached.data;
}

module.exports = {
  getFromCache,
  setToCache
};
