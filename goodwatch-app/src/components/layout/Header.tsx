import Link from "next/link";

const navItems = [
  { label: "Films", href: "#movies" },
  { label: "Series", href: "#series" },
  { label: "Collections", href: "#collections" },
  { label: "Critics", href: "#critics" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="flex items-center gap-3 text-lg font-semibold tracking-tight"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-black shadow-card">
            GW
          </span>
          <span className="text-gradient text-xl font-bold">Goodwatch Studio</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-white/70 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="hidden rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white/20 hover:text-white md:inline-flex">
            Sign in
          </button>
          <button className="rounded-full bg-gradient-to-r from-amber-400 to-orange-500 px-5 py-2 text-sm font-semibold text-black shadow-lg shadow-orange-500/25 transition hover:shadow-orange-500/40">
            Start tracking
          </button>
        </div>
      </div>
    </header>
  );
}
