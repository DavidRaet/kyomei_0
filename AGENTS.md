# Repository Guidelines

## Project Structure & Architecture

Kyomei is a React 19, TypeScript, and Vite single-page anime discovery app. Source lives in `src/`: `main.tsx` owns routing and home-page data/state, while `App.tsx` is the presentational home layout. Route-level components and reusable UI belong in `src/components/`; browser-persisted watchlist logic is in `src/hooks/`; API clients and caching are in `src/api/`; shared data models are in `src/types/`; and focused utilities and their tests sit together, for example `src/utils/yearMatch.ts` and `yearMatch.test.ts`.

Static files belong in `public/` or `src/assets/`. Product/design notes are in `docs/`. Treat `CONTRACT.md` as the source of truth for the Kyomei API; the client must use `src/api/animeProvider.ts`, not call third-party anime providers directly.

## Build, Test, and Development Commands

- `npm install` installs dependencies (use Node 20.x or 22.x).
- `npm run dev` starts the Vite development server with hot reload.
- `npm run build` type-checks with `tsc -b` and creates `dist/`.
- `npm run lint` runs the ESLint flat configuration.
- `npm test` runs Vitest once; use `npx vitest` for watch mode.
- `npm test -- --coverage` produces V8 coverage, matching CI.
- `npm run preview` serves the production build locally.

Before opening a pull request, run `npm run tsc` `npm run lint`, `npm test`, and `npm run build`.

## Coding Style & Naming Conventions

Use TypeScript for application code, two-space indentation, single quotes, and no semicolons, matching existing `src/` files. Name React components in `PascalCase` (`AnimeCard.tsx`), hooks as `useX` (`useWatchlist.ts`), and utilities in camelCase (`yearMatch.ts`). Prefer explicit `type` imports, e.g. `import type { Anime } from '../types/types'`; TypeScript rejects unused identifiers and non-erasable constructs such as enums. Use relative imports because no path aliases are configured.

## Testing Guidelines

Write Vitest tests beside the unit they exercise using `*.test.ts` or `*.test.tsx`. Cover normal behavior and meaningful edge cases, especially pure transformations, filtering, cache behavior, and persistence. CI runs linting and coverage tests on Node 20 and 22 for pushes and pull requests targeting `main` or `develop`.

## Commit & Pull Request Guidelines

Follow the established Conventional Commit pattern: `feat: add seasonal endpoint`, `fix: handle empty results`, or `docs: update contract`. Keep commits small and focused. Pull requests should state the user-facing change, list validation commands run, link the relevant issue when available, and include screenshots for visual/UI changes. Call out API-contract or cache-TTL changes explicitly.
