# Goodwatch Studio

A fresh Next.js 15 + Tailwind CSS codebase that recreates the discovery experience of [goodwatch.app](https://goodwatch.app/). The starter ships with a cinematic UI, mocked TMDB/JustWatch driven data flows, and a modular folder structure so that the real API integrations can be dropped in feature-by-feature.

## Why this project exists

The legacy Watchy codebase was tightly coupled to a single-page search flow and relied on ad-hoc TMDB/JustWatch calls. Rather than untangling those constraints, this repo gives us a clean slate that mirrors the Goodwatch product surface:

- **Hero discovery experience** that highlights one featured title, platform availability, and mood tags.
- **Trending rails** for films and series backed by TMDB trending endpoints.
- **Curated collections** and **critics spotlights** structured to ingest editorial datasets.
- **Service filter hub** ready to plug into JustWatch country/provider switches.

Use it as the foundation for a production build, or as a sandbox to validate integrations before migrating existing users.

## Tech stack

- [Next.js 15](https://nextjs.org/) in the App Router
- [React 19](https://react.dev/)
- [Tailwind CSS v4](https://tailwindcss.com/) with design tokens defined in CSS
- [TypeScript](https://www.typescriptlang.org/)
- [clsx](https://github.com/lukeed/clsx) for ergonomic class merging
- Turbopack dev/build commands for fast iteration

## Project structure

```text
src/
├─ app/
│  ├─ layout.tsx      # Metadata + global shell
│  ├─ page.tsx        # Home experience composed from sections
│  └─ globals.css     # Tailwind + design tokens
├─ components/
│  ├─ layout/         # Header & footer
│  ├─ sections/       # Hero, rails, critics, collections, filters
│  └─ ui/             # Low-level UI primitives (badge, rating indicator)
├─ data/
│  └─ mockContent.ts  # Sample data shaped like TMDB/JustWatch responses
└─ types/
   └─ content.ts      # Shared domain types
```

## Local development

1. Install dependencies (Node 18+ recommended):

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Visit [http://localhost:3000](http://localhost:3000) to explore the Goodwatch-style interface.

4. Lint the project anytime to keep a clean baseline:

   ```bash
   npm run lint
   ```

### Environment variables

When you wire up the real services, add an `.env.local` file at the project root. Recommended keys:

```bash
TMDB_API_KEY=""
TMDB_API_BASE_URL="https://api.themoviedb.org/3"
JUSTWATCH_COUNTRY="TR"
NEXT_PUBLIC_DEFAULT_REGION="TR"
```

Create typed API clients under `src/lib/` and swap the mocked data imports in `src/data/mockContent.ts` with live fetchers.

## Implementation roadmap

1. **API layer** – build dedicated fetchers for TMDB (trending, discover, details) and JustWatch (availability by title + region).
2. **Caching & revalidation** – leverage Next.js server actions or route handlers for deterministic caching windows.
3. **State management** – introduce TanStack Query or server components to hydrate UI with live data.
4. **User accounts** – integrate Supabase/Auth.js for watchlists and personalized filters.
5. **Testing** – add Playwright smoke tests plus React Testing Library coverage for section components.

## Deploying

The project is optimized for [Vercel](https://vercel.com/) but works with any Node-compatible host. Run `npm run build` to produce the production bundle.

## Publishing to GitHub

1. [Create a new repository](https://github.com/new) on your GitHub account (leave it empty, without a README or .gitignore).
2. Initialize git locally and commit the starter:

   ```bash
   git init
   git add .
   git commit -m "feat: bootstrap Goodwatch Studio"
   ```

3. Add your GitHub remote (replace `<USERNAME>` and `<REPO>`):

   ```bash
   git remote add origin https://github.com/<USERNAME>/<REPO>.git
   ```

4. Push the code:

   ```bash
   git push -u origin main
   ```

5. (Optional) Create additional branches for features and open pull requests as you iterate.

That’s it—your Goodwatch-inspired rebuild is ready to evolve.
