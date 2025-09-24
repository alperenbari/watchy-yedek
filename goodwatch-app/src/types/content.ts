export type RatingBreakdown = {
  source: "tmdb" | "imdb" | "metacritic" | "rottenTomatoes";
  score: number;
  scale: 10 | 100;
};

export type PlatformAvailability = {
  id: string;
  name: string;
  logoUrl: string;
  type: "stream" | "rent" | "buy" | "ad";
  regions: string[];
};

export type ContentSummary = {
  id: number;
  title: string;
  type: "movie" | "series";
  releaseYear: number;
  tagline: string;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  moods: string[];
  ratings: RatingBreakdown[];
  platforms: PlatformAvailability[];
};

export type CuratedCollection = {
  id: string;
  title: string;
  description: string;
  highlightColor: string;
  items: ContentSummary[];
};

export type CriticsHighlight = {
  outlet: string;
  quote: string;
  critic: string;
  icon: string;
  recommendation: ContentSummary;
};

export type ServiceFilter = {
  id: string;
  label: string;
  category: "stream" | "rent" | "buy" | "subscription" | "ad";
  icon: string;
};

export type HeroFeature = {
  headline: string;
  subheading: string;
  description: string;
  backgroundUrl: string;
  trailerUrl: string;
  featured: ContentSummary;
};
