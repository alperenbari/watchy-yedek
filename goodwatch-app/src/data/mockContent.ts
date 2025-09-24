import type {
  ContentSummary,
  CriticsHighlight,
  CuratedCollection,
  HeroFeature,
  ServiceFilter,
} from "@/types/content";

const defaultPlatforms = {
  netflix: {
    id: "netflix",
    name: "Netflix",
    logoUrl:
      "https://images.ctfassets.net/4cd45et68cgf/6cSjSrjHGqZqiWx7xGf0yj/534e53ce38adcb7631c6fba88028c52f/Netflix_Logo_PMS.png",
    type: "stream" as const,
    regions: ["US", "TR", "DE", "FR"],
  },
  disney: {
    id: "disney",
    name: "Disney+",
    logoUrl:
      "https://images.ctfassets.net/4cd45et68cgf/2vGac15KiVa7yOGG7R1uO4/2666ebadc177a64eab2d869077ec1cfc/Disney_Plus_logo_2021.svg",
    type: "stream" as const,
    regions: ["US", "TR", "UK", "ES"],
  },
  prime: {
    id: "prime",
    name: "Prime Video",
    logoUrl:
      "https://images.ctfassets.net/4cd45et68cgf/2aKQ6akdT8wz3uo3LQWg7m/a433eb1073a698ec40fba3ef0beed0bb/Prime_Video_logo.svg",
    type: "stream" as const,
    regions: ["US", "TR", "CA", "BR"],
  },
  apple: {
    id: "apple",
    name: "Apple TV+",
    logoUrl:
      "https://images.ctfassets.net/4cd45et68cgf/1rWHAXoVYlFy7bB4jN39MY/da90fa8b0ca595d4a1a278e6b8980c97/Apple_TV_Plus_logo.svg",
    type: "stream" as const,
    regions: ["US", "TR", "AU", "JP"],
  },
  mubi: {
    id: "mubi",
    name: "MUBI",
    logoUrl:
      "https://images.ctfassets.net/4cd45et68cgf/2NOqX5nCXdFuOtXv3P5F5L/3c2406ed43a868867eaa583c1aa0b92a/MUBI_Logo.svg",
    type: "stream" as const,
    regions: ["TR", "FR", "IT", "MX"],
  },
  max: {
    id: "max",
    name: "Max",
    logoUrl:
      "https://images.ctfassets.net/4cd45et68cgf/3MKbUyGJPDd7CMqsH2mkyS/7b8792c673217e9b852ebbce125dc377/Max_logo.svg",
    type: "stream" as const,
    regions: ["US", "BR", "MX"],
  },
};

const dunePartTwo: ContentSummary = {
  id: 693134,
  title: "Dune: Part Two",
  type: "movie",
  releaseYear: 2024,
  tagline: "Destiny arrives with the sands of Arrakis.",
  synopsis:
    "Paul Atreides reunites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family, balancing love, prophecy, and galactic politics.",
  posterUrl: "https://image.tmdb.org/t/p/w500/8b8R8l88QkdaiJJzwJ3BaiE3zIX.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/original/1zXjWmMGjUFg1LrXk6sZ2xkMKet.jpg",
  moods: ["Epic", "Mind-bending", "Sci-Fi"],
  ratings: [
    { source: "tmdb", score: 8.3, scale: 10 },
    { source: "imdb", score: 83, scale: 100 },
    { source: "metacritic", score: 79, scale: 100 },
  ],
  platforms: [defaultPlatforms.max, defaultPlatforms.apple],
};

const theBear: ContentSummary = {
  id: 153312,
  title: "The Bear",
  type: "series",
  releaseYear: 2022,
  tagline: "Welcome to the family meal.",
  synopsis:
    "A young chef from the fine-dining world returns home to Chicago to run his family sandwich shop after a heartbreaking death, bringing discipline to a kitchen in freefall.",
  posterUrl: "https://image.tmdb.org/t/p/w500/wF3m2Q1qNJ3w7S9ibcLIOiWraH.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/original/wwmy1Kvt6NdMzoaUeu9xx0Pmk1p.jpg",
  moods: ["Character-driven", "Intense", "Dramedy"],
  ratings: [
    { source: "tmdb", score: 8.6, scale: 10 },
    { source: "imdb", score: 87, scale: 100 },
    { source: "metacritic", score: 88, scale: 100 },
  ],
  platforms: [defaultPlatforms.disney, defaultPlatforms.mubi],
};

const poorThings: ContentSummary = {
  id: 792307,
  title: "Poor Things",
  type: "movie",
  releaseYear: 2023,
  tagline: "An incredible tale of life and discovery.",
  synopsis:
    "Bella Baxter, brought back to life by Dr. Godwin Baxter, runs off with a lawyer to experience the world, free from the prejudices of her times.",
  posterUrl: "https://image.tmdb.org/t/p/w500/6AaK8lBxTH2DNh3dXyUlbTV0vM8.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/original/a8e81eQwtaW7dEoU9K1YE0E3h5L.jpg",
  moods: ["Whimsical", "Bold", "Romantic"],
  ratings: [
    { source: "tmdb", score: 7.9, scale: 10 },
    { source: "imdb", score: 81, scale: 100 },
    { source: "metacritic", score: 89, scale: 100 },
  ],
  platforms: [defaultPlatforms.disney, defaultPlatforms.mubi],
};

const loki: ContentSummary = {
  id: 84958,
  title: "Loki",
  type: "series",
  releaseYear: 2021,
  tagline: "Glorious purpose finds a new timeline.",
  synopsis:
    "Loki teams up with Mobius and a TVA team to find Sylvie, fix the timeline, and uncover the truth behind the Time Variance Authority.",
  posterUrl: "https://image.tmdb.org/t/p/w500/kEl2t3OhXc3Zb9FBh1AuYzRTgZp.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/original/hbNU5Xzv8anY3RmC2QAleHuO1lp.jpg",
  moods: ["Time bending", "Stylish", "Adventurous"],
  ratings: [
    { source: "tmdb", score: 8.1, scale: 10 },
    { source: "imdb", score: 80, scale: 100 },
  ],
  platforms: [defaultPlatforms.disney],
};

const anatomyOfAFall: ContentSummary = {
  id: 915935,
  title: "Anatomy of a Fall",
  type: "movie",
  releaseYear: 2023,
  tagline: "Truth is never simple.",
  synopsis:
    "Sandra, Samuel, and their sight-impaired son Daniel have been living in the French Alps. After Samuel is found dead, Sandra becomes the main suspect and must prove her innocence in court.",
  posterUrl: "https://image.tmdb.org/t/p/w500/kjQBrc00fB2RjHZB3PGR4w9ibpz.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/original/9DPG1gxLwV3NP9oP9u42MtJ9PpQ.jpg",
  moods: ["Courtroom", "Psychological", "Slow burn"],
  ratings: [
    { source: "tmdb", score: 7.5, scale: 10 },
    { source: "imdb", score: 77, scale: 100 },
    { source: "metacritic", score: 89, scale: 100 },
  ],
  platforms: [defaultPlatforms.mubi, defaultPlatforms.apple],
};

const shogun: ContentSummary = {
  id: 209867,
  title: "Shōgun",
  type: "series",
  releaseYear: 2024,
  tagline: "Power knows no equal.",
  synopsis:
    "Shipwrecked in feudal Japan, English navigator John Blackthorne is pulled into the dangerous political games of Lord Toranaga.",
  posterUrl: "https://image.tmdb.org/t/p/w500/6VSA53tDbrmOwZgxw2n8T4xQ2NU.jpg",
  backdropUrl: "https://image.tmdb.org/t/p/original/ueO9MYIOHO7M1PiMUeX74uf8fBz.jpg",
  moods: ["Historical", "Epic", "Character drama"],
  ratings: [
    { source: "tmdb", score: 8.7, scale: 10 },
    { source: "imdb", score: 87, scale: 100 },
    { source: "metacritic", score: 88, scale: 100 },
  ],
  platforms: [defaultPlatforms.disney, defaultPlatforms.apple],
};

export const heroFeature: HeroFeature = {
  headline: "Stream smarter with cinematic intelligence",
  subheading: "Your personal watch strategist across every major service",
  description:
    "Track premieres, compare critics' scores, and spot where to watch with a single search. Built on TMDB and JustWatch data, designed for film lovers in Türkiye and beyond.",
  backgroundUrl: dunePartTwo.backdropUrl,
  trailerUrl: "https://www.youtube.com/watch?v=U2Qp5pL3ovA",
  featured: dunePartTwo,
};

export const curatedCollections: CuratedCollection[] = [
  {
    id: "awards-spotlight",
    title: "Awards season winners",
    description: "Hand-picked champions from Cannes to the Oscars.",
    highlightColor: "from-amber-400/90 to-orange-600/70",
    items: [poorThings, anatomyOfAFall, dunePartTwo],
  },
  {
    id: "series-to-binge",
    title: "Series to binge now",
    description: "Critically adored seasons under 10 hours.",
    highlightColor: "from-sky-400/80 to-indigo-500/60",
    items: [theBear, shogun, loki],
  },
];

export const trendingMovies: ContentSummary[] = [
  dunePartTwo,
  poorThings,
  anatomyOfAFall,
];

export const trendingSeries: ContentSummary[] = [theBear, shogun, loki];

export const criticsHighlights: CriticsHighlight[] = [
  {
    outlet: "The Atlantic",
    quote:
      "A modern space opera that finally trusts its audience to sit with mythic ambition.",
    critic: "Shirley Li",
    icon: "https://img.icons8.com/?size=512&id=59763&format=png",
    recommendation: dunePartTwo,
  },
  {
    outlet: "Vulture",
    quote:
      "Television that captures the chaos and tenderness of real kitchen life.",
    critic: "Kathryn VanArendonk",
    icon: "https://img.icons8.com/?size=512&id=ShDkzuT1E95L&format=png",
    recommendation: theBear,
  },
];

export const serviceFilters: ServiceFilter[] = [
  { id: "netflix", label: "Netflix", category: "stream", icon: defaultPlatforms.netflix.logoUrl },
  { id: "disney", label: "Disney+", category: "stream", icon: defaultPlatforms.disney.logoUrl },
  { id: "prime", label: "Prime Video", category: "stream", icon: defaultPlatforms.prime.logoUrl },
  { id: "apple", label: "Apple TV+", category: "stream", icon: defaultPlatforms.apple.logoUrl },
  { id: "mubi", label: "MUBI", category: "stream", icon: defaultPlatforms.mubi.logoUrl },
  { id: "max", label: "Max", category: "stream", icon: defaultPlatforms.max.logoUrl },
];
