import Image from "next/image";

import type { ServiceFilter } from "@/types/content";

export function ServiceFilters({ services }: { services: ServiceFilter[] }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-card md:p-10">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">Streaming services</h2>
          <p className="text-sm text-white/60">
            Compare availability across Türkiye, US, and EU regions with a click.
          </p>
        </div>
        <button className="self-start rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:border-white/30 hover:text-white">
          Configure regions
        </button>
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {services.map((service) => (
          <button
            key={service.id}
            className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/10"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-white/10">
              <Image
                src={service.icon}
                alt={service.label}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{service.label}</p>
              <p className="text-[11px] uppercase tracking-wide text-white/50">
                {service.category}
              </p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
