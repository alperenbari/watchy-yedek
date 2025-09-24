import Image from "next/image";

import type { MoodSpotlight } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export function MoodSpotlights({ spotlights }: { spotlights: MoodSpotlight[] }) {
  return (
    <section id="moods" className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Mood playlists</h2>
          <p className="text-sm text-white/60">
            Goodwatch’s editorial team curates mood-driven journeys using TMDB genres and JustWatch availability.
          </p>
        </div>
        <Badge variant="outline">Updated every morning</Badge>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {spotlights.map((spotlight) => (
          <article
            key={spotlight.id}
            className={`relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${spotlight.gradient} p-[1px] shadow-card`}
          >
            <div className="flex h-full flex-col gap-6 rounded-[calc(1.5rem-1px)] bg-black/80 p-6">
              <div>
                <h3 className="text-lg font-semibold text-white">{spotlight.title}</h3>
                <p className="mt-1 text-sm text-white/60">{spotlight.description}</p>
              </div>
              <div className="space-y-4">
                {spotlight.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-3"
                  >
                    <div className="relative h-16 w-12 overflow-hidden rounded-xl">
                      <Image
                        src={item.posterUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <p className="text-xs text-white/50">{item.moods.join(" • ")}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="mt-auto w-full rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/30 hover:text-white">
                Launch playlist
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
