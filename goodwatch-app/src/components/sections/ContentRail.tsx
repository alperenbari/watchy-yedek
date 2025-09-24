import type { ContentSummary } from "@/types/content";
import { ContentCard } from "@/components/sections/ContentCard";

export function ContentRail({
  id,
  title,
  description,
  items,
}: {
  id: string;
  title: string;
  description?: string;
  items: ContentSummary[];
}) {
  return (
    <section id={id} className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          {description ? (
            <p className="text-sm text-white/60">{description}</p>
          ) : null}
        </div>
        <a
          href="#"
          className="text-sm font-semibold text-white/70 transition hover:text-white"
        >
          Explore all →
        </a>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
