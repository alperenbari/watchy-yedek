class WatchyScoreCalculator {
    constructor({ imdb, tmdb, likeCount, dislikeCount, viewCount, commentCount, earlyViews, sentimentScore }) {
      this.imdb = imdb || 0;
      this.tmdb = tmdb || 0;
      this.likeCount = likeCount || 0;
      this.dislikeCount = dislikeCount || 0;
      this.viewCount = viewCount || 0;
      this.commentCount = commentCount || 0;
      this.earlyViews = earlyViews || 0;
      this.sentimentScore = sentimentScore || 0; // 0–100
    }
  
    normalize(value, max = 100) {
      return Math.min(Math.max(value, 0), max);
    }
  
    calc() {
      const totalLikes = this.likeCount + this.dislikeCount;
      const likeRatio = totalLikes > 0 ? (this.likeCount / totalLikes) * 100 : 0;
  
      const imdbScore = this.normalize(this.imdb * 10);
      const tmdbScore = this.normalize(this.tmdb * 10);
  
      const viewScore = this.viewCount > 0 ? this.normalize(Math.log10(this.viewCount) * 10) : 0;
      const commentScore = this.normalize((this.commentCount / 1000) * 20);
      const engagementRate = this.viewCount > 0 ? this.normalize(((this.likeCount + this.commentCount) / this.viewCount) * 100) : 0;
      const earlyViewRate = this.viewCount > 0 ? this.normalize((this.earlyViews / this.viewCount) * 100) : 0;
      const sentiment = this.normalize(this.sentimentScore);
  
      const score =
        imdbScore * 0.30 +
        tmdbScore * 0.10 +
        likeRatio * 0.15 +
        viewScore * 0.10 +
        commentScore * 0.10 +
        engagementRate * 0.10 +
        earlyViewRate * 0.10 +
        sentiment * 0.05;
  
      return Math.round(score * 100) / 100;
    }
  }
  
  module.exports = WatchyScoreCalculator;
  