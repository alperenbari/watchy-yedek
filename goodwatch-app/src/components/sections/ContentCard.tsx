import Image from "next/image";

import type { ContentSummary } from "@/types/content";
import { Badge } from "@/components/ui/Badge";
import { RatingIndicator } from "@/components/ui/RatingIndicator";

function formatMoods(moods: string[]) {
  return moods.join(" · ");
}

export function ContentCard({ item }: { item: ContentSummary }) {
  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-card border border-white/5 bg-black/40 shadow-card transition duration-500 hover:-translate-y-1 hover:shadow-card-hover">
      <div className="relative aspect-[2/3] overflow-hidden">
        <Image
          src={item.posterUrl}
          alt={item.title}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
          sizes="(min-width: 768px) 240px, 60vw"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/90 via-black/0 to-transparent p-4">
          <Badge variant="default">{item.type === "movie" ? "Film" : "Series"}</Badge>
          <span className="text-xs font-medium text-white/70">
            {item.releaseYear}
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <h3 className="text-lg font-semibold text-white">{item.title}</h3>
          <p className="mt-1 text-sm text-white/60">{item.tagline}</p>
        </div>
        <p className="line-clamp-3 text-sm text-white/50">{item.synopsis}</p>
        <div className="flex flex-wrap gap-2 text-xs text-white/60">
          {item.moods.map((mood) => (
            <span
              key={mood}
              className="rounded-full border border-white/10 px-3 py-1"
            >
              {mood}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
          <div className="flex gap-3">
            {item.ratings.map((rating) => (
              <RatingIndicator key={rating.source} rating={rating} />
            ))}
          </div>
          <span className="text-xs uppercase tracking-wide text-white/50">
            {formatMoods(item.platforms.map((platform) => platform.name))}
          </span>
        </div>
      </div>
    </article>
  );
}
