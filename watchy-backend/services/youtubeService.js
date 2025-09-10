const axios = require('axios');
const normalize = require('./normalize');
const { getFromCache, setToCache } = require('./youtubeCache');

const YOUTUBE_API_KEY = 'AIzaSyA-oDIGD36fFsDvIJ9sFvRcKjGyCBfViPU';

const YOUTUBE_CHANNELS = [
  { name: "BKM", channelId: "UCS4FzKibc3HRsvJmPfT0Dtw" },
  { name: "TAFF", channelId: "UC6NkaGn8sIPY9z2e6-QKjRA" },
  { name: "Erler Film", channelId: "UC4R8DWoMoI7CAwX8_LjQHig" },
  { name: "Arzu Film", channelId: "UCv-VAk0nnBYnCTsRmR2719g" },
  { name: "Asya Film", channelId: "UCdRkPp9MnVu2TCeH49a4nDg" },
  { name: "Boyut Film", channelId: "UCsyLGz2JAAyQoGh4HsdZKCw" },
  { name: "Özen Film", channelId: "UCL9E8v0AmwAexIgCVHkAxRg" },
  { name: "NuLook", channelId: "UCULeH6lqe49fQBfJ84x221A" },
  { name: "Avşar Film", channelId: "UCQTXcY4WyDbV4ZQvdcGX0Kw" }
];

async function findOnOfficialYouTubeChannels(title) {
  const cached = getFromCache(title);
  if (cached !== null) {
    return cached; // ✅ Cache'ten dön
  }

  for (const channel of YOUTUBE_CHANNELS) {
    try {
      const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
        params: {
          part: 'snippet',
          q: title,
          key: YOUTUBE_API_KEY,
          channelId: channel.channelId,
          type: 'video',
          videoDuration: 'long',
          maxResults: 5
        }
      });

      const items = res.data.items || [];

      for (const item of items) {
        const videoId = item?.id?.videoId;
        const videoTitle = item?.snippet?.title || '';

        if (videoId && normalize(videoTitle).includes(normalize(title))) {
          const result = {
            provider_name: 'YouTube',
            logo_path: '/yt',
            link: `https://www.youtube.com/watch?v=${videoId}`
          };
          setToCache(title, result); // ✅ Cache'e kaydet
          return result;
        }
      }

    } catch (err) {
      console.error(`🔴 YouTube arama hatası (${channel.name}):`, err.response?.data?.error || err.message);
    }
  }

  setToCache(title, null); // ❌ Sonuç yoksa bile cache'e ekle
  return null;
}

module.exports = {
  findOnOfficialYouTubeChannels
};
