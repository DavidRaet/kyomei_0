# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Kyomei (共鳴 — "resonance") is David's personal anime discovery app: search/browse anime, filter results, view anime detail pages, and keep a localStorage-backed watchlist.

`docs/prd/Kyomei-MVP-PRD-v2.md` describes a much larger future vision (Go backend, Auth0 auth, PostgreSQL, a taste-profile recommendation engine, ratings, social features). **None of that exists yet** — the current app is a pure client-side SPA, with no backend, no auth, and no database. Treat the PRD as directional/aspirational, not a description of current architecture. `docs/prd/p0.md` extracts just the P0 items from that PRD for reference. `docs/caching-layer.md` is a from-scratch writeup of the client-side response cache (`src/api/cache.ts`), written as part of the AniList migration (see below) — read it before touching cache TTLs or the memory/localStorage layering.

## Commands

- `npm run dev` — Vite dev server with HMR
- `npm run build` — runs `tsc -b && vite build`; this is also the project's type-check (build fails on TS errors)
- `npm run lint` — ESLint flat config
- `npm test` — `vitest run` (single pass, no watch)
- `npx vitest` — watch mode
- `npx vitest run src/utils/yearMatch.test.ts` — run a single test file
- `npm test -- --coverage` — coverage via `@vitest/coverage-v8` (matches what CI runs)
- `npm run preview` — preview the production build

CI (`.github/workflows/ci_cd_workflow.yml`) runs lint + `npm test -- --coverage` on Node 20.x/22.x, then deploys to Vercel on push to `main`. If `npm ci` fails in CI but passes locally, don't hand-edit `package-lock.json` — delete it and `node_modules` and run a fresh `npm install` (Vite's rolldown optional bindings are platform-gated, so a Windows-generated lockfile can be incomplete on the Linux CI runner).

## Architecture

**Container/presentational split across routing.** `src/main.tsx` defines the router (`/`, `/anime/:id`, `/watchlist`) and contains `Root`, a smart container that owns every piece of state and data-fetching for the home route: search query/filters, trending/seasonal/search results, and loading/error state, delegating the actual fetch to `src/api/animeProvider.ts`. `Root` renders `src/App.tsx`, which is purely presentational — it receives everything as props and owns no state beyond the search input's local form submit wiring. When changing home-route behavior, the fetch/state logic is in `main.tsx`; the layout/markup is in `App.tsx`.

`AnimeDetailPage` and `WatchlistPage` (in `src/components/`) are route components in their own right, not children of `App` — each owns its own state and fetches independently (also via `animeProvider.ts`) rather than receiving props from `main.tsx`.

**Data fetching (`src/api/`) — AniList-first with a Jikan fallback.** `animeProvider.ts` is the only module the rest of the app should import for anime data (`getAnimeList`, `getAnimeById`, `getCharacters`). Each function tries AniList's GraphQL API (`anilist.ts`) first and falls back to Jikan v4 REST (`jikan.ts`) on any failure (network error, timeout, GraphQL error). In dev, `console.info` logs which source actually answered each call. Every call is wrapped in `withCache` (`cache.ts`) — see `docs/caching-layer.md` for the full design; in short: an in-memory `Map` plus an optional `localStorage` layer, keyed by request identity (e.g. `list:trending:12`, `detail:{id}`), with per-endpoint TTLs (trending 15 min, seasonal 60 min, search 2 min/memory-only, detail/characters 30 min). The cache stores whatever source actually resolved the request — it doesn't retry AniList just because a fallback occurred.

**Data shapes** (`src/types/`):
- `Anime` (`types.ts`) is the canonical normalized shape used everywhere except the detail page. Two independent normalizers convert raw provider responses into it: `normalizeJikanAnime` in `jikan.ts` (from `JikanAnimeRaw`, `jikan-raw-type.ts`) and the AniList-side mapper in `anilist.ts` (from `AniListMediaRaw`, `anilist-raw-type.ts`, using `FORMAT_MAP`/`STATUS_MAP` to translate AniList's enum values to Jikan-style strings so downstream filtering code stays provider-agnostic).
- `AnimeDetail` (`anime-detail.ts`) is a separate, richer shape used by `AnimeDetailPage` for `/anime/:id` — populated by either provider, not derived from `Anime`.
- `WatchlistEntry` (`watchlist.ts`) extends `Anime` with `status` and `addedAt`.
- `ActiveFilters`/`FilterKey` (`types.ts`) plus the option constants in `filter-options.ts` (`GENRE_OPTIONS`, `YEAR_OPTIONS`, etc.) drive `FilterDropdown`. Filtering is entirely client-side over already-fetched results (`doesMatchFilter` in `main.tsx`); the year filter buckets by decade via `matchesDecadeYear` (`src/utils/yearMatch.ts`).

**Watchlist persistence** (`src/hooks/useWatchlist.ts`) is a from-scratch localStorage store, not a state library: `addToWatchlist`/`removeFromWatchlist` are plain functions that read/write `localStorage['kyomei.watchlist']` and then `dispatchEvent(new Event('kyomei-watchlist'))`; the `useWatchlist()` hook subscribes to that custom event plus the native `storage` event so every mounted instance (including other tabs) stays in sync without prop drilling or context.

**Fallback data**: `src/mocks.ts` (`mockAiring`, `mockSeasonal`) backs the trending/seasonal sections whenever the live fetch hasn't resolved yet (`trending ? trending : mockAiring` in `main.tsx`) — the UI never shows the loading skeleton for these two sections.

**Known stub**: on `AnimeDetailPage`, the `ErrorState`'s `onRetry` is a no-op (`() => {}`) — the retry button doesn't re-trigger the failed detail fetch. (The home route's retry handlers — `onRetryTrending`/`onRetrySeasonal`/`onRetrySearch` in `main.tsx` — are fully wired and do re-fetch.)

## Stack notes worth knowing

- React 19, Vite 8 (rolldown-based), TypeScript 6 (`package.json` pins `typescript: ~6.0.2` — bleeding-edge), react-router-dom 6.
- ESLint flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- `tsconfig.app.json` enables `verbatimModuleSyntax` and `erasableSyntaxOnly` — type-only imports must use `import type { Foo } from '...'`, and runtime-only TS constructs (enums, namespaces, parameter properties) will error.
- `noUnusedLocals` and `noUnusedParameters` are on — don't leave dead identifiers around.
- No path aliases configured; use relative imports.

## External APIs

**AniList GraphQL** (`https://graphql.anilist.co`) is the primary source, called via `POST` from `src/api/anilist.ts` with a 6s abort-controller timeout. No auth required for the public queries used here.

**Jikan v4** (`https://api.jikan.moe/v4`, unofficial MyAnimeList REST) is the fallback, used automatically whenever an AniList call fails. No auth, rate-limited to ~3 req/sec; `jikan.ts` retries once on a `504` before giving up. Endpoints in use:
- Trending: `GET /top/anime?limit={n}`
- Seasonal: `GET /seasons/now?limit={n}`
- Search: `GET /anime?q={query}&limit={n}&order_by=score&sort=desc`
- Detail: `GET /anime/{id}`
- Characters: `GET /anime/{id}/characters`

Both providers are fetched directly from the client — there is no backend proxy. List endpoints from Jikan wrap results in `{ data: [...] }`; always unwrap. Nested optional fields (`images?.webp?.image_url`, etc.) should be accessed with `?.` — neither provider guarantees every field is present on every title.
