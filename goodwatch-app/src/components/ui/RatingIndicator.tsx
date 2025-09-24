import type { RatingBreakdown } from "@/types/content";

const sourceLabels: Record<RatingBreakdown["source"], string> = {
  tmdb: "TMDB",
  imdb: "IMDb",
  metacritic: "Metacritic",
  rottenTomatoes: "Rotten Tomatoes",
};

export function RatingIndicator({ rating }: { rating: RatingBreakdown }) {
  const { source, score, scale } = rating;
  const normalized = scale === 10 ? Math.round(score * 10) : score;
  const percentage = Math.min(100, Math.max(0, normalized));

  return (
    <div className="flex flex-col items-center rounded-xl border border-white/5 bg-white/5 px-3 py-2 text-[11px] uppercase text-white/70">
      <span className="text-white/60">{sourceLabels[source]}</span>
      <div className="mt-1 flex items-end gap-1">
        <span className="text-lg font-semibold text-white">
          {scale === 10 ? score.toFixed(1) : score}
        </span>
        <span className="text-xs text-white/50">/{scale}</span>
      </div>
      <div className="mt-2 h-1.5 w-12 overflow-hidden rounded-full bg-white/10">
        <span
          className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
