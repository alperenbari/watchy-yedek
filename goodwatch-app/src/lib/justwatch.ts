import "server-only";

type JustWatchVariables = {
  country: string;
  language: string;
  ids: number[];
};

type JustWatchOffer = {
  monetizationType: "BUY" | "RENT" | "FLATRATE" | "ADS" | "FREE";
  presentationType: "SD" | "HD" | "4K";
  standardWebURL: string;
  providerID: number;
};

type JustWatchNode = {
  id: string;
  content: {
    externalID: string;
    objectType: "MOVIE" | "SHOW";
    title: string;
    shortDescription: string;
    scoring: Array<{
      source: string;
      value: number;
    }>;
    offers: JustWatchOffer[];
  };
};

type JustWatchResponse = {
  data: {
    popularTitles: {
      edges: JustWatchNode[];
    };
  };
};

const JUSTWATCH_ENDPOINT =
  process.env.JUSTWATCH_ENDPOINT ?? "https://apis.justwatch.com/graphql";

export async function fetchJustWatchAvailability({
  country = process.env.JUSTWATCH_COUNTRY ?? "TR",
  language = "en",
  ids,
}: JustWatchVariables) {
  const response = await fetch(JUSTWATCH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "goodwatch-studio/1.0",
    },
    body: JSON.stringify({
      query: `
        query PopularTitles($country: Country!, $language: Language!, $ids: [ID!]) {
          popularTitles(country: $country, language: $language, first: 50, filter: {ids: $ids}) {
            edges {
              node {
                id
                content {
                  externalID
                  objectType
                  title
                  shortDescription
                  scoring {
                    source
                    value
                  }
                  offers {
                    monetizationType
                    presentationType
                    providerID
                    standardWebURL
                  }
                }
              }
            }
          }
        }
      `,
      variables: {
        country,
        language,
        ids: ids.map(String),
      },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`JustWatch request failed: ${response.status} ${response.statusText} - ${payload}`);
  }

  const json = (await response.json()) as JustWatchResponse;
  return json.data.popularTitles.edges;
}
