import Image from "next/image";

import type { HeroFeature } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export function HeroShowcase({ feature }: { feature: HeroFeature }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/40 shadow-spotlight">
      <div className="absolute inset-0">
        <Image
          src={feature.backgroundUrl}
          alt={feature.featured.title}
          fill
          priority
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />
      </div>
      <div className="relative flex flex-col gap-10 px-8 py-16 md:flex-row md:px-14 md:py-20">
        <div className="max-w-xl space-y-6">
          <Badge variant="outline">Powered by TMDB + JustWatch</Badge>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            <span className="text-gradient block">{feature.headline}</span>
          </h1>
          <p className="text-lg text-white/70 md:text-xl">{feature.subheading}</p>
          <p className="max-w-lg text-sm text-white/60 md:text-base">
            {feature.description}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={feature.trailerUrl}
              className="inline-flex items-center gap-3 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-black/30 transition hover:bg-white/90"
            >
              Watch trailer
            </a>
            <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition hover:border-white/40 hover:text-white">
              Add to watchlist
            </button>
          </div>
        </div>
        <div className="relative mx-auto mt-10 w-full max-w-sm md:mt-0">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-4 shadow-card">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl">
              <Image
                src={feature.featured.posterUrl}
                alt={feature.featured.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="mt-4 space-y-2 text-sm text-white/70">
              <div className="flex items-center justify-between">
                <p className="text-base font-semibold text-white">
                  {feature.featured.title}
                </p>
                <span>{feature.featured.releaseYear}</span>
              </div>
              <p className="line-clamp-3 text-white/60">
                {feature.featured.synopsis}
              </p>
              <div className="flex flex-wrap gap-2">
                {feature.featured.moods.map((mood) => (
                  <span
                    key={mood}
                    className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-wide text-white/60"
                  >
                    {mood}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
