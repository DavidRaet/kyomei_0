import type { SubmitEvent } from 'react';
import type { ActiveFilters, Anime, CardVariant, FilterKey } from './types';
import { AnimeCard } from './components/AnimeCard';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { IconSearch } from './components/icons';
import { PosterOrbit } from './components/PosterOrbit';
import { Section } from './components/Section';
import { SkeletonGrid } from './components/SkeletonGrid';

const FILTER_KEYS: FilterKey[] = ['Genre', 'Year', 'Season', 'Format', 'Status'];

interface AppProps {
  trending: Anime[] | null;
  seasonal: Anime[] | null;
  searchResults: Anime[] | null;
  loading: boolean;
  error: string | null;
  query: string;
  submitted: string;
  activeFilters: ActiveFilters;
  cardVariant?: CardVariant;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onClearSearch: () => void;
  onRetry: () => void;
  onFilterToggle: (key: FilterKey) => void;
}

export default function App({
  trending,
  seasonal,
  searchResults,
  loading,
  error,
  query,
  submitted,
  activeFilters,
  cardVariant = 'poster',
  onQueryChange,
  onSubmit,
  onClearSearch,
  onRetry,
  onFilterToggle,
}: AppProps) {
  
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const showingResults = submitted.length > 0;

  return (
    <div className="app">
      {/* Left rail */}
      <aside className="rail">
        <div className="rail-jp">共 鳴</div>
        <div className="rail-dot" />
        <div className="rail-num">VOL.01 · MMXXVI</div>
      </aside>

      {/* Main column */}
      <main className="main">
        {/* Top bar */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">Kyomei</div>
            <div className="brand-jp">共鳴</div>
            <div className="brand-sub">An Anime Index</div>
          </div>
          <nav className="nav">
            <a href="#" className="active">
              Browse
            </a>
          </nav>
          <div className="top-meta">
            <span className="dot" />
            <span>Live · Jikan</span>
          </div>
        </header>

        {/* Hero / Search */} 
        <section className="hero">
          <PosterOrbit posters={trending ?? []} />
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="line" />
              <span>Volume 01 · Spring 2026 — Issue 04</span>
            </div>
            <h1 className="hero-title">
              Find the series that <em>resonates.</em>
              <span className="jp">響</span>
            </h1>
            <p className="hero-tagline">
              Kyomei is a hand-tuned index of anime — curated for collectors and cinephiles.
              Search 28,000+ titles by name, romaji, or kanji. Filter by season, format, and mood.
            </p>

            <form className="search-row" onSubmit={handleSubmit}>
              <label className="search">
                <span className="icn">
                  <IconSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search by title, romaji, or kanji — e.g. Frieren, 葬送のフリーレン"
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  autoFocus
                />
                <span className="kbd">↵ Enter</span>
              </label>
              <button type="submit" className="search-btn">
                Search
              </button>
            </form>

            <div className="filters">
              <span className="filter-label">Refine</span>
              {FILTER_KEYS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`chip ${activeFilters[f] ? 'active' : ''}`}
                  onClick={() => onFilterToggle(f)}
                >
                  {f}
                  <span className="caret" />
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Body: search results or default browse */}
        {showingResults ? (
          <Section
            num="①"
            title="Results"
            titleEm={`for "${submitted}"`}
            jp="結果"
            meta={
              !loading && !error && searchResults && searchResults.length > 0 ? (
                <>
                  <span className="pill">{searchResults.length} titles</span>
                  <span>Sorted by score</span>
                </>
              ) : null
            }
          >
            {loading ? (
              <SkeletonGrid count={12} />
            ) : error ? (
              <ErrorState message={error} onRetry={onRetry} />
            ) : searchResults && searchResults.length === 0 ? (
              <EmptyState query={submitted} onReset={onClearSearch} />
            ) : searchResults ? (
              <div className="grid grid-6">
                {searchResults.map((a, i) => (
                  <AnimeCard key={a.id} anime={a} variant={cardVariant} index={i} />
                ))}
              </div>
            ) : null}
          </Section>
        ) : (
          <>
            <Section
              num="①"
              title="Trending"
              titleEm="Now"
              jp="話題作"
              meta={
                <>
                  <span className="pill">Live · Top airing</span>
                  <span>View all →</span>
                </>
              }
            >
              {trending === null ? (
                <SkeletonGrid count={12} />
              ) : trending.length === 0 ? (
                <ErrorState message="Couldn't reach the trending feed." onRetry={onRetry} />
              ) : (
                <div className="grid grid-6">
                  {trending.slice(0, 12).map((a, i) => (
                    <AnimeCard key={a.id} anime={a} variant={cardVariant} index={i} />
                  ))}
                </div>
              )}
            </Section>

            <Section
              num="②"
              title="Popular"
              titleEm="this season"
              jp=" 今期人気"
              meta={
                <>
                  <span className="pill">Spring · 2026</span>
                  <span>View all →</span>
                </>
              }
            >
              {seasonal === null ? (
                <SkeletonGrid count={12} />
              ) : seasonal.length === 0 ? (
                <ErrorState message="Couldn't reach the seasonal feed." onRetry={onRetry} />
              ) : (
                <div className="grid grid-6">
                  {seasonal.slice(0, 12).map((a, i) => (
                    <AnimeCard key={a.id} anime={a} variant={cardVariant} index={i} />
                  ))}
                </div>
              )}
            </Section>
          </>
        )}

        <footer className="foot">
          <div>© MMXXVI · Kyomei</div>
          <div className="jp">共鳴 — 響き合う物語の索引</div>
          <div>Powered by Jikan / MAL</div>
        </footer>
      </main>

      {/* Right rail */}
      <aside className="rail rail-r">
        <div className="rail-num">EST · 2026</div>
        <div className="rail-jp upright">共 鳴</div>
        <div className="rail-dot" />
      </aside>
    </div>
  );
}
