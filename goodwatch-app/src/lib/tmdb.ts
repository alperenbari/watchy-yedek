import "server-only";

const TMDB_API_BASE_URL = process.env.TMDB_API_BASE_URL ?? "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

type TMDBRequestOptions = {
  query?: Record<string, string | number | boolean | undefined>;
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
};

type NextFetchRequestConfig = {
  revalidate?: number | false;
  tags?: string[];
};

type TMDBPagedResponse<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

async function tmdbFetch<T>(path: string, { query, cache = "force-cache", next }: TMDBRequestOptions = {}): Promise<T> {
  const url = new URL(path.startsWith("http") ? path : `${TMDB_API_BASE_URL}${path}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined) return;
      url.searchParams.set(key, String(value));
    });
  }

  const headers: HeadersInit = TMDB_API_KEY
    ? {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        "Content-Type": "application/json;charset=utf-8",
      }
    : {};

  const response = await fetch(url, {
    headers,
    cache,
    next,
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`TMDB request failed: ${response.status} ${response.statusText} - ${errorBody}`);
  }

  return (await response.json()) as T;
}

type TMDBMediaResult = {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type?: "movie" | "tv";
  vote_average: number;
  vote_count: number;
};

type TMDBWatchProviderResult = {
  results: Record<
    string,
    {
      flatrate?: TMDBProvider[];
      rent?: TMDBProvider[];
      buy?: TMDBProvider[];
      ads?: TMDBProvider[];
    }
  >;
};

type TMDBProvider = {
  provider_id: number;
  provider_name: string;
  logo_path: string;
};

export async function getTrendingMedia({
  mediaType = "all",
  timeWindow = "day",
  language = "en-US",
  region = "TR",
}: {
  mediaType?: "all" | "movie" | "tv";
  timeWindow?: "day" | "week";
  language?: string;
  region?: string;
}) {
  const data = await tmdbFetch<TMDBPagedResponse<TMDBMediaResult>>(`/trending/${mediaType}/${timeWindow}`, {
    query: { language, region },
    next: { revalidate: 60 * 30, tags: ["tmdb", "trending", mediaType, timeWindow] },
  });
  return data.results;
}

export async function discoverTitles({
  mediaType = "movie",
  language = "en-US",
  region = "TR",
  sortBy = "popularity.desc",
  withWatchProviders,
  watchRegion,
}: {
  mediaType?: "movie" | "tv";
  language?: string;
  region?: string;
  sortBy?: string;
  withWatchProviders?: string;
  watchRegion?: string;
}) {
  return tmdbFetch<TMDBPagedResponse<TMDBMediaResult>>(`/discover/${mediaType}`, {
    query: {
      language,
      region,
      sort_by: sortBy,
      with_watch_providers: withWatchProviders,
      watch_region: watchRegion ?? region,
    },
    next: { revalidate: 60 * 60, tags: ["tmdb", "discover", mediaType] },
  });
}

export async function getTitleDetails({
  id,
  mediaType = "movie",
  language = "en-US",
  appendToResponse,
}: {
  id: number;
  mediaType?: "movie" | "tv";
  language?: string;
  appendToResponse?: string;
}) {
  return tmdbFetch(`/${mediaType}/${id}`, {
    query: { language, append_to_response: appendToResponse },
    next: { revalidate: 60 * 10, tags: ["tmdb", mediaType, String(id)] },
  });
}

export async function getWatchProviders({
  id,
  mediaType = "movie",
  language = "en-US",
}: {
  id: number;
  mediaType?: "movie" | "tv";
  language?: string;
}) {
  return tmdbFetch<TMDBWatchProviderResult>(`/${mediaType}/${id}/watch/providers`, {
    query: { language },
    next: { revalidate: 60 * 60, tags: ["tmdb", "providers", mediaType, String(id)] },
  });
}
