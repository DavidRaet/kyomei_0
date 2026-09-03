# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

Kyomei (共鳴 — "resonance") is David's personal anime discovery app: search/browse anime, filter results, view anime detail pages, and keep a localStorage-backed watchlist.

`docs/prd/Kyomei-MVP-PRD-v2.md` describes a much larger future vision (Go backend, Auth0 auth, PostgreSQL, a taste-profile recommendation engine, ratings, social features). **Most of that doesn't exist yet** — there's no auth and no database, and this repo (`kyomei_0`) is still a client-side SPA with all watchlist state in `localStorage`. It does now have a backend counterpart, `kyomei_api` (a separate repo, FastAPI), which orchestrates AniList lookups and caching server-side; `CONTRACT.md` at the repo root is the source of truth for that HTTP boundary — read it before changing anything in `src/api/`. Treat the PRD as directional/aspirational beyond what `CONTRACT.md` documents as live. `docs/prd/p0.md` extracts just the P0 items from that PRD for reference. `docs/caching-layer.md` is a from-scratch writeup of the client-side response cache (`src/api/cache.ts`) — read it before touching cache TTLs or the memory/localStorage layering.

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

**Data fetching (`src/api/`) — `kyomei_api`-only.** `animeProvider.ts` is the only module the rest of the app should import for anime data (`getAnimeList`, `getAnimeById`, `getCharacters`); it delegates every call to `kyomeiApi.ts`, which uses the same-origin `/api` path per the endpoints in `CONTRACT.md`. Vite proxies that path during development and Vercel rewrites it to `kyomei_api` in production. Use `KYOMEI_API_PROXY_TARGET` to point Vite at a local backend when needed. There is no client-side AniList/Jikan fallback anymore — that orchestration now lives server-side, inside `kyomei_api` itself. Every call is wrapped in `withCache` (`cache.ts`) — see `docs/caching-layer.md` for the full design; in short: an in-memory `Map` plus an optional `localStorage` layer, keyed by request identity (e.g. `list:trending:12`, `detail:{id}`), with per-endpoint TTLs (trending 15 min, seasonal 60 min, search 2 min/memory-only, detail/characters 30 min).

**Data shapes** (`src/types/`):
- `Anime` (`types.ts`) is the canonical normalized shape used everywhere except the detail page, mapped from `kyomei_api`'s `AnimeSummary` (`CONTRACT.md`) by `mapSummaryToAnime` in `kyomeiApi.ts` — a straight field-for-field conversion (only `malId` → `mal_id` differs).
- `AnimeDetail` (`anime-detail.ts`) extends `Anime` with the detail-page-only fields (`titleRomaji`, `synopsis`, `durationMinutes`, `airedFrom`/`airedTo`, `trailerImage`), mirroring `CONTRACT.md`'s `AnimeDetail extends AnimeSummary`. `CharacterEntry` similarly mirrors `CharacterSummary`. Both are mapped from the raw contract shape by `kyomeiApi.ts`.
- `WatchlistEntry` (`watchlist.ts`) extends `Anime` with `status` and `addedAt`.
- `ActiveFilters`/`FilterKey` (`types.ts`) plus the option constants in `filter-options.ts` (`GENRE_OPTIONS`, `YEAR_OPTIONS`, etc.) drive `FilterDropdown`. Filtering is entirely client-side over already-fetched results (`doesMatchFilter` in `main.tsx`); the year filter buckets by decade via `matchesDecadeYear` (`src/utils/yearMatch.ts`).

**Watchlist persistence** (`src/hooks/useWatchlist.ts`) is a from-scratch localStorage store, not a state library: `addToWatchlist`/`removeFromWatchlist` are plain functions that read/write `localStorage['kyomei.watchlist']` and then `dispatchEvent(new Event('kyomei-watchlist'))`; the `useWatchlist()` hook subscribes to that custom event plus the native `storage` event so every mounted instance (including other tabs) stays in sync without prop drilling or context.

**Failure visibility**: the browse route shows a loading skeleton while its live feeds are pending and an `ErrorState` when either feed fails; it does not substitute mock data for failed API requests.

**Known stub**: on `AnimeDetailPage`, the `ErrorState`'s `onRetry` is a no-op (`() => {}`) — the retry button doesn't re-trigger the failed detail fetch. (The home route's retry handlers — `onRetryTrending`/`onRetrySeasonal`/`onRetrySearch` in `main.tsx` — are fully wired and do re-fetch.)

## Stack notes worth knowing

- React 19, Vite 8 (rolldown-based), TypeScript 6 (`package.json` pins `typescript: ~6.0.2` — bleeding-edge), react-router-dom 6.
- ESLint flat config (`eslint.config.js`) with `typescript-eslint`, `eslint-plugin-react-hooks`, and `eslint-plugin-react-refresh`.
- `tsconfig.app.json` enables `verbatimModuleSyntax` and `erasableSyntaxOnly` — type-only imports must use `import type { Foo } from '...'`, and runtime-only TS constructs (enums, namespaces, parameter properties) will error.
- `noUnusedLocals` and `noUnusedParameters` are on — don't leave dead identifiers around.
- No path aliases configured; use relative imports.

## External APIs

**`kyomei_api`** is the only backend `kyomei_0` talks to for anime data — see `CONTRACT.md` for the full endpoint list (`GET /v1/anime/{malId}`, `/v1/anime/search`, `/v1/anime/trending`, `/v1/anime/seasonal`, `/v1/anime/{malId}/characters`), request/response shapes, and error codes. `kyomeiApi.ts` calls it via `fetch` with a 6s abort-controller timeout, no auth (v1 is unauthenticated). `kyomei_api` itself orchestrates AniList server-side and is rate-limited per client IP (`429` with `Retry-After`) — `kyomei_0` has no retry logic of its own for that. List endpoints wrap results in `{ data: [...] }`; always unwrap. If an endpoint, field, or status code isn't in `CONTRACT.md`, don't assume it exists.
