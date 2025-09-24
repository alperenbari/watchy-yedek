"use client";

import { useState } from "react";

import type { DiscoveryBucket } from "@/types/content";
import { ContentCard } from "@/components/sections/ContentCard";
import { Badge } from "@/components/ui/Badge";

export function DiscoveryTabs({ buckets }: { buckets: DiscoveryBucket[] }) {
  const [activeId, setActiveId] = useState(buckets[0]?.id ?? "");
  const activeBucket = buckets.find((bucket) => bucket.id === activeId) ?? buckets[0];

  if (!activeBucket) {
    return null;
  }

  return (
    <section id="discover" className="space-y-6 rounded-3xl border border-white/10 bg-black/40 p-8 shadow-card md:p-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-white">Discovery radar</h2>
          <p className="max-w-xl text-sm text-white/60">
            Mirrors the goodwatch.app home page: tabs for what is streaming now, what is coming soon,
            and what is leaving your queue.
          </p>
        </div>
        <Badge variant="outline">Synced with TMDB & JustWatch</Badge>
      </div>
      <div className="flex flex-wrap gap-3">
        {buckets.map((bucket) => (
          <button
            key={bucket.id}
            onClick={() => setActiveId(bucket.id)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              activeBucket.id === bucket.id
                ? "bg-white text-black shadow-lg shadow-black/30"
                : "border border-white/15 text-white/70 hover:border-white/30 hover:text-white"
            }`}
            type="button"
          >
            {bucket.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-white/60">{activeBucket.tagline}</p>
        {activeBucket.ctaLabel ? (
          <a
            href="#"
            className="text-sm font-semibold text-white/80 transition hover:text-white"
          >
            {activeBucket.ctaLabel} →
          </a>
        ) : null}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {activeBucket.items.map((item) => (
          <ContentCard key={`${activeBucket.id}-${item.id}`} item={item} />
        ))}
      </div>
    </section>
  );
}
