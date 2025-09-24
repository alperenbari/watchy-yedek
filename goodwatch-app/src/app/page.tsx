import { CriticsSpotlight } from "@/components/sections/CriticsSpotlight";
import { ContentRail } from "@/components/sections/ContentRail";
import { CuratedCollections } from "@/components/sections/CuratedCollections";
import { HeroShowcase } from "@/components/sections/HeroShowcase";
import { ServiceFilters } from "@/components/sections/ServiceFilters";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import {
  criticsHighlights,
  curatedCollections,
  heroFeature,
  serviceFilters,
  trendingMovies,
  trendingSeries,
} from "@/data/mockContent";

export default function HomePage() {
  return (
    <div className="min-h-screen pb-20 text-white">
      <Header />
      <main className="mx-auto mt-16 flex w-full max-w-6xl flex-col gap-16 px-6">
        <HeroShowcase feature={heroFeature} />
        <ServiceFilters services={serviceFilters} />
        <ContentRail
          id="movies"
          title="Trending films"
          description="Pulled from TMDB's daily trending endpoint with availability from JustWatch."
          items={trendingMovies}
        />
        <ContentRail
          id="series"
          title="Trending series"
          description="Multi-country support for where-to-watch makes follow-ups effortless."
          items={trendingSeries}
        />
        <CuratedCollections collections={curatedCollections} />
        <CriticsSpotlight highlights={criticsHighlights} />
      </main>
      <Footer />
    </div>
  );
}
