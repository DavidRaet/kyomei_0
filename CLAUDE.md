# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Kyomei (共鳴 — "resonance") is David's personal anime discovery app: search/browse anime via the Jikan API, filter results, view anime detail pages, and keep a localStorage-backed watchlist.

`docs/Kyomei-MVP-PRD-v2.md` describes a much larger future vision (Go backend, Auth0 auth, PostgreSQL, a taste-profile recommendation engine, ratings, social features). **None of that exists yet** — the current app is a pure client-side SPA hitting Jikan directly, with no backend, no auth, and no database. Treat the PRD as directional/aspirational, not a description of current architecture. `docs/archive_docs/feature_doc/` holds the earlier, smaller PRDs from the learning phase (feature-1/2/3-prd.md, kyomei-react-relearn-prd.md) — useful for history, not current spec.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — runs `tsc -b && vite build`; this is also the project's type-check (build fails on TS errors)
- `npm run lint` — ESLint flat config
- `npm test` — `vitest run` (single pass, no watch)
- `npx vitest` — watch mode
- `npx vitest run src/utils/yearMatch.test.ts` — run a single test file
- `npm test -- --coverage` — coverage via `@vitest/coverage-v8` (matches what CI runs)
- `npm run preview` — preview the production build

CI (`.github/workflows/ci_cd_workflow.yml`) runs lint + `npm test -- --coverage` on Node 20.x/22.x, then deploys to Vercel on push to `main`. If `npm ci` fails in CI but passes locally, don't hand-edit `package-lock.json` — delete it and `node_modules` and run a fresh `npm install` (see `docs/archive_docs/lessons/ci-npm-ci-lockfile-out-of-sync.md`; Vite's rolldown optional bindings are platform-gated, so a Windows-generated lockfile can be incomplete on the Linux CI runner).

## Architecture

**Container/presentational split across routing.** `src/main.tsx` defines the router (`/`, `/anime/:id`, `/watchlist`) and contains `Root`, a smart container that owns every piece of state and data-fetching for the home route: search query/filters, trending/seasonal/search results, loading/error state, and the Jikan fetches themselves. `Root` renders `src/App.tsx`, which is purely presentational — it receives everything as props and owns no state beyond the search input's local form submit wiring. When changing home-route behavior, the fetch/state logic is in `main.tsx`; the layout/markup is in `App.tsx`.

`AnimeDetailPage` and `WatchlistPage` (in `src/components/`) are route components in their own right, not children of `App` — each owns its own state and fetches independently rather than receiving props from `main.tsx`.

**Data shapes** (`src/types/`):
- `Anime` (`types.ts`) is the canonical normalized shape used everywhere except the detail page. `main.tsx`'s `normalizeAnimeData()` converts raw Jikan responses (typed as `JikanAnimeRaw` in `jikan-raw-type.ts`) into this shape.
- `AnimeDetail` (`anime-detail.ts`) is a separate, richer shape fetched directly by `AnimeDetailPage` for `/anime/:id` — it is not derived from `Anime` and isn't normalized.
- `WatchlistEntry` (`watchlist.ts`) extends `Anime` with `status` and `addedAt`.
- `ActiveFilters`/`FilterKey` (`types.ts`) plus the option constants in `filter-options.ts` (`GENRE_OPTIONS`, `YEAR_OPTIONS`, etc.) drive `FilterDropdown`. Filtering is entirely client-side over already-fetched results (`doesMatchFilter` in `main.tsx`); the year filter buckets by decade via `matchesDecadeYear` (`src/utils/yearMatch.ts`).

**Watchlist persistence** (`src/hooks/useWatchlist.ts`) is a from-scratch localStorage store, not a state library: `addToWatchlist`/`removeFromWatchlist` are plain functions that read/write `localStorage['kyomei.watchlist']` and then `dispatchEvent(new Event('kyomei-watchlist'))`; the `useWatchlist()` hook subscribes to that custom event plus the native `storage` event so every mounted instance (including other tabs) stays in sync without prop drilling or context.

**Fallback data**: `src/mocks.ts` (`mockAiring`, `mockSeasonal`) backs the trending/seasonal sections whenever the live Jikan fetch hasn't resolved yet (`trending ?? mockAiring` in `main.tsx`) — the UI never shows the loading skeleton for these two sections.

**Known stub**: `onRetry` passed into `App` from `main.tsx` is currently a no-op (`/* TODO */`); the retry button on error states doesn't yet re-trigger the failed fetch.

## Stack notes worth knowing

- React 19, Vite 8 (rolldown-based), TypeScript 6 (`package.json` pins `typescript: ~6.0.2` — bleeding-edge), react-router-dom 6.
- ESLint flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- `tsconfig.app.json` enables `verbatimModuleSyntax` and `erasableSyntaxOnly` — type-only imports must use `import type { Foo } from '...'`, and runtime-only TS constructs (enums, namespaces, parameter properties) will error.
- `noUnusedLocals` and `noUnusedParameters` are on — don't leave dead identifiers around.
- No path aliases configured; use relative imports.

## External API

Jikan v4 (unofficial MyAnimeList REST). No auth, rate-limited to ~3 req/sec. Fetched directly from the client — there is no backend proxy.

- Trending: `GET https://api.jikan.moe/v4/top/anime?limit={n}`
- Seasonal: `GET https://api.jikan.moe/v4/seasons/now?limit={n}`
- Search: `GET https://api.jikan.moe/v4/anime?q={query}&limit={n}&order_by=score&sort=desc`
- Detail: `GET https://api.jikan.moe/v4/anime/{id}`
- Characters: `GET https://api.jikan.moe/v4/anime/{id}/characters`

List endpoints wrap results in `{ data: [...] }`; always unwrap. Nested optional fields (`images?.webp?.image_url`, etc.) should be accessed with `?.` — Jikan does not guarantee every field is present on every title (see `docs/archive_docs/lessons/bug-typeerror-webp.md` for a concrete case where a missing `?.` combined with a copy-pasted fetch/state-setter mismatch caused a hard crash).