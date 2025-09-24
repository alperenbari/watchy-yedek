import Image from "next/image";

import type { CriticsHighlight } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export function CriticsSpotlight({ highlights }: { highlights: CriticsHighlight[] }) {
  return (
    <section
      id="critics"
      className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-card md:p-12"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Critics spotlight</h2>
          <p className="text-sm text-white/60">
            Trusted voices surface a daily pick from your queue.
          </p>
        </div>
        <Badge variant="outline">Rotten Tomatoes + Metacritic</Badge>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {highlights.map((highlight) => (
          <article
            key={`${highlight.outlet}-${highlight.recommendation.id}`}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="flex items-start gap-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white/10">
                <Image
                  src={highlight.icon}
                  alt={highlight.outlet}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm uppercase tracking-wide text-white/50">
                  {highlight.outlet}
                </p>
                <p className="mt-2 text-lg font-semibold text-white">
                  “{highlight.quote}”
                </p>
                <p className="mt-4 text-sm text-white/60">— {highlight.critic}</p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-white/5 bg-black/60 p-4">
              <div className="relative h-20 w-16 overflow-hidden rounded-xl">
                <Image
                  src={highlight.recommendation.posterUrl}
                  alt={highlight.recommendation.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  {highlight.recommendation.title}
                </p>
                <p className="text-xs text-white/50">
                  {highlight.recommendation.tagline}
                </p>
              </div>
              <button className="ml-auto rounded-full border border-white/15 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/30 hover:text-white">
                View details
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
