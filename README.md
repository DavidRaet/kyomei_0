# Kyomei (共鳴 - "resonance")

Kyomei is a personal anime discovery app: search and browse anime through the Kyomei API, filter results, view detail pages, and keep a localStorage-backed watchlist.

> **Current scope:** this is a client-side SPA backed by the Kyomei API. There is no auth or database, and the browser does not connect directly to the anime data provider. See [Roadmap](#roadmap--future-vision) below for what's planned vs. what exists today.

## Features

- Browse trending and currently-airing seasonal anime
- Search with client-side filters (genre, year/decade, etc.)
- Anime detail pages (synopsis, characters, metadata)
- Watchlist that persists to `localStorage` and stays in sync across tabs

## Tech stack

- React 19 + TypeScript 6
- Vite 8 (rolldown-based)
- react-router-dom 6
- Vitest (+ `@vitest/coverage-v8`)
- ESLint flat config (`typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`)

## Getting started

Requires Node 20.x or 22.x (matches the versions run in CI).

```bash
npm install
npm run dev
```

No API key or `.env` setup is needed to run the frontend locally. Requests use
the Vite `/api` proxy, which targets the deployed Kyomei API by default. To use
a local `kyomei_api` instance instead, create `.env.local` with:

```bash
KYOMEI_API_PROXY_TARGET=http://localhost:8000
```

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Type-check (`tsc -b`) and build for production |
| `npm run lint` | Run ESLint |
| `npm test` | Run the test suite once (`vitest run`) |
| `npx vitest` | Run tests in watch mode |
| `npm test -- --coverage` | Run tests with coverage (matches CI) |
| `npm run preview` | Preview the production build locally |

## Project structure

- [`src/main.tsx`](src/main.tsx) - router setup and `Root`, the container that owns state/data-fetching for the home route
- [`src/App.tsx`](src/App.tsx) - presentational home-route layout, driven entirely by props from `Root`
- [`src/components/`](src/components/) - route components (`AnimeDetailPage`, `WatchlistPage`) and shared UI
- [`src/hooks/useWatchlist.ts`](src/hooks/useWatchlist.ts) - localStorage-backed watchlist store with cross-tab sync
- [`src/types/`](src/types/) - normalized (`Anime`), detail (`AnimeDetail`), and watchlist data shapes

See [CLAUDE.md](CLAUDE.md) for the full architecture writeup, including data-shape details and known stubs.

## Anime data

The frontend fetches anime data through the Kyomei API, which is powered by [AniList](https://anilist.co/). The browser does not call AniList directly. Browser requests stay same-origin at `/api`; Vite proxies them in development and Vercel rewrites them to the Kyomei API in production.

## Roadmap / future vision

[`docs/prd/Kyomei-MVP-PRD-v2.md`](docs/prd/Kyomei-MVP-PRD-v2.md) describes a much larger, aspirational product: a Go backend, Auth0 authentication, PostgreSQL, and a taste-profile-driven recommendation engine with ratings and social features. **None of that exists in this repo yet.** Treat the PRD as directional, not as a description of current architecture.

## Known limitations

- The retry button on error states (`onRetry`) is currently a no-op stub - it doesn't re-trigger the failed fetch
- No persistence beyond the browser's `localStorage` (watchlist only - search/filter state resets on reload)
