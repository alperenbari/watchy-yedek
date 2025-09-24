export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 text-sm text-white/60 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-base font-semibold text-white">Goodwatch Studio</p>
          <p className="mt-1 max-w-md text-sm text-white/60">
            Built on top of TMDB and JustWatch APIs to deliver a cinematic discovery experience that respects your taste and your time.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <a href="#" className="hover:text-white">
            Privacy
          </a>
          <a href="#" className="hover:text-white">
            Terms
          </a>
          <a href="#" className="hover:text-white">
            Changelog
          </a>
          <a href="#" className="hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
