import Image from "next/image";

import type { CuratedCollection } from "@/types/content";
import { Badge } from "@/components/ui/Badge";

export function CuratedCollections({
  collections,
}: {
  collections: CuratedCollection[];
}) {
  return (
    <section
      id="collections"
      className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-card md:p-12"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">Curated journeys</h2>
          <p className="text-sm text-white/60">
            Hand-built playlists combining TMDB metadata with JustWatch availability.
          </p>
        </div>
        <Badge variant="outline" className="mt-2 md:mt-0">
          Updated daily
        </Badge>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {collections.map((collection) => (
          <article
            key={collection.id}
            className="group relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 via-white/0 to-white/5 p-[1px]"
          >
            <div className="rounded-[calc(1.5rem-1px)] bg-black/80 p-6">
              <header className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    {collection.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    {collection.description}
                  </p>
                </div>
                <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${collection.highlightColor}`} />
              </header>
              <div className="mt-6 grid gap-4">
                {collection.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4 rounded-2xl border border-white/5 bg-white/5 p-3 transition hover:border-white/20 hover:bg-white/10"
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
                      <p className="text-sm font-semibold text-white">
                        {item.title}
                      </p>
                      <p className="text-xs text-white/50">
                        {item.moods.join(" • ")}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
