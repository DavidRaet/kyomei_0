import type { SubmitEvent } from 'react';
import type { ActiveFilters, Anime, CardVariant, FilterKey } from './types/types';
import {
  GENRE_OPTIONS,
  YEAR_OPTIONS,
  SEASON_OPTIONS,
  FORMAT_OPTIONS,
  STATUS_OPTIONS,
} from './types/filter-options';
import { AnimeCard } from './components/AnimeCard';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { FilterDropdown } from './components/FilterDropdown';
import { IconSearch } from './components/icons';
import { PosterOrbit } from './components/PosterOrbit';
import { Section } from './components/Section';
import { SkeletonGrid } from './components/SkeletonGrid';
import { Link } from 'react-router-dom';

const FILTER_KEYS: FilterKey[] = ['Genre', 'Year', 'Season', 'Format', 'Status'];

const FILTER_OPTIONS_BY_KEY: Record<FilterKey, readonly string[]> = {
  Genre: GENRE_OPTIONS,
  Year: YEAR_OPTIONS,
  Season: SEASON_OPTIONS,
  Format: FORMAT_OPTIONS,
  Status: STATUS_OPTIONS,
};

interface AppProps {
  trending: Anime[] | null;
  seasonal: Anime[] | null;
  searchResults: Anime[] | null;
  loading: boolean;
  error: string | null;
  query: string;
  submitted: string;
  activeFilters: ActiveFilters;
  openFilter: FilterKey | null;
  cardVariant?: CardVariant;
  onQueryChange: (value: string) => void;
  onSubmit: () => void;
  onClearSearch: () => void;
  onRetryTrending: () => void;
  onRetrySeasonal: () => void;
  onRetrySearch: () => void;
  onOpenFilter: (key: FilterKey | null) => void;
  onFilterToggle: (key: FilterKey, option: string) => void;
  onNavigate: (mal_id: number) => void;
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
  openFilter,
  cardVariant = 'poster',
  onQueryChange,
  onSubmit,
  onClearSearch,
  onRetryTrending,
  onRetrySeasonal,
  onRetrySearch,
  onOpenFilter,
  onFilterToggle,
  onNavigate,
}: AppProps) {

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
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
            <Link className='active' to='/'>
              Browse
            </Link>
            <Link to='/watchlist'>
              Watchlist
            </Link>
          </nav>
          <div className="top-meta">
            <span className="dot" />
            <span>Live · AniList</span>
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
                <FilterDropdown
                  key={f}
                  filterKey={f}
                  options={FILTER_OPTIONS_BY_KEY[f]}
                  selected={activeFilters[f]}
                  isOpen={openFilter === f}
                  onToggleOpen={() => onOpenFilter(openFilter === f ? null : f)}
                  onSelectOption={(option) => onFilterToggle(f, option)}
                />
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
              <ErrorState message={error} onRetry={onRetrySearch} />
            ) : searchResults && searchResults.length === 0 ? (
              <EmptyState query={submitted} onReset={onClearSearch} />
            ) : searchResults ? (
              <div className="grid grid-6">
                {searchResults.map((a, i) => (
                  <AnimeCard key={a.mal_id} anime={a} variant={cardVariant} index={i} onNavigate={onNavigate} />
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
                <ErrorState message="Couldn't reach the trending feed." onRetry={onRetryTrending} />
              ) : (
                <div className="grid grid-6">
                  {trending.slice(0, 12).map((a, i) => (
                    <AnimeCard key={a.mal_id} anime={a} variant={cardVariant} index={i} onNavigate={onNavigate} />
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
                <ErrorState message="Couldn't reach the seasonal feed." onRetry={onRetrySeasonal} />
              ) : (
                <div className="grid grid-6">
                  {seasonal.slice(0, 12).map((a, i) => (
                    <AnimeCard key={a.mal_id} anime={a} variant={cardVariant} index={i} onNavigate={onNavigate} />
                  ))}
                </div>
              )}
            </Section>
          </>
        )}

        <footer className="foot">
          <div>© MMXXVI · Kyomei</div>
          <div className="jp">共鳴 — 響き合う物語の索引</div>
          <div>Powered by AniList, fallback via MAL</div>
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
