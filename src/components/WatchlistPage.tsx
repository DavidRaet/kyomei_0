import { Link } from 'react-router-dom';
import type { WatchlistEntry } from '../types/watchlist';
import { useWatchlist, removeFromWatchlist } from '../hooks/useWatchlist';
import { IconSearch, IconCaret, IconX } from './icons';
import { useState } from 'react';

function progressText(e: WatchlistEntry): string {
  const tot = e.episodes ?? null;
  if (e.status === 'completed') return tot ? `${tot} / ${tot}` : 'Complete';
  return tot ? `— / ${tot}` : '—';
}

function WlTopBar() {
  return (
    <header className="topbar d-topbar">
      <div className="brand">
        <Link className="d-back" to="/" aria-label="Back to browse">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <div className="brand-mark">Kyomei</div>
        <div className="brand-jp">共鳴</div>
      </div>
      <nav className="nav">
        <Link to="/">Browse</Link>
        <Link to="/watchlist" className="active">Watchlist</Link>
      </nav>
      <div className="top-meta">
        <span className="dot" />
        <span>Local · Saved</span>
      </div>
    </header>
  );
}

function WlRow({ e }: { e: WatchlistEntry }) {
  return (
    <Link className="wl-row" to={`/anime/${e.mal_id}`}>
      <div className="wl-c-title">
        <div className="wl-thumb">{e.image && <img src={e.image} alt="" loading="lazy" />}</div>
        <span className="wl-title">{e.titleEnglish}</span>
      </div>
      <div className="wl-c-score">{e.score ? e.score.toFixed(1) : '—'}</div>
      <div className="wl-c-prog">{progressText(e)}</div>
      <div className="wl-c-type">{e.format || 'TV'}</div>
      <button
        className="wl-remove"
        type="button"
        title="Remove from watchlist"
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          removeFromWatchlist(e.mal_id);
        }}
      >
        <IconX />
      </button>
    </Link>
  );
}

function WlTable({ title, jp, items }: { title: string; jp: string; items: WatchlistEntry[] }) {
  return (
    <div className="wl-section">
      <div className="wl-sec-hd">
        <h2>
          {title}
          <span className="jp">{jp}</span>
        </h2>
        <span className="wl-count">{items.length}</span>
      </div>
      <div className="wl-table">
        <div className="wl-row wl-head">
          <div className="wl-c-title">Title</div>
          <div className="wl-c-score">Score</div>
          <div className="wl-c-prog">Progress</div>
          <div className="wl-c-type">Type</div>
          <div className="wl-c-act" />
        </div>
        {items.map((e) => (
          <WlRow key={e.mal_id} e={e} />
        ))}
      </div>
    </div>
  );
}

export function WatchlistPage() {
  const watchlist = useWatchlist();

  // TODO: lift these into real controlled state (useState) and apply them to `list`
  // to produce the filtered/sorted `view` below.

  const [query, setQuery] = useState<string>('');
  const [format, setFormat] = useState<'all' | 'tv'>('all');
  const [genre, setGenre] = useState<string>('all');
  const [sort, setSort] = useState<'title' | 'score' | 'recent'>('score');

  const onQueryChange = (value: string) => { setQuery(value); };
  const onFormatChange = (value: string) => { setFormat(value as 'all' | 'tv'); };
  const onGenreChange = (value: string) => { setGenre(value); };
  const onSortChange = (value: string) => { setSort(value as 'title' | 'score' | 'recent'); };
  
  const formats = Array.from(new Set(watchlist.map((e) => e.format).filter(Boolean))).sort();
  const genres = Array.from(new Set(watchlist.flatMap((e) => e.genres))).sort();
  const filteredWatchList = watchlist.filter((e) => {
    const matchesQuery = query ? e.titleEnglish.toLowerCase().includes(query.toLowerCase()) : true;
    const matchesFormat = format === 'all' ? true : e.format === format;
    const matchesGenre = genre === 'all' ? true : e.genres.includes(genre);
    return matchesQuery && matchesFormat && matchesGenre;
  })
  
  const view = filteredWatchList;

  return (
    <div className="wl">
      <WlTopBar />

      <section className="wl-hero">
        <div className="hero-eyebrow">
          <span className="line" />
          <span>Your collection · ローカル保存</span>
        </div>
        <h1 className="wl-h1">
          Watchlist <span className="jp">鑑賞記録</span>
        </h1>
        <p className="wl-sub">
          {watchlist.length
            ? `${watchlist.length} ${watchlist.length === 1 ? 'title' : 'titles'} on your watchlist.`
            : 'Nothing saved yet — start adding titles from any anime page.'}
        </p>
      </section>

      <div className="wl-body">
        {/* sidebar */}
        <aside className="wl-side">
          <label className="wl-search">
            <IconSearch size={15} />
            <input
              type="text"
              placeholder="Filter"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
            />
          </label>

          <div className="wl-side-grp">
            <div className="wl-side-label">Filters</div>
            <div className="wl-field">
              <select value={format} onChange={(e) => onFormatChange(e.target.value)}>
                <option value="all">Format · Any</option>
                {formats.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <span className="wl-field-caret">
                <IconCaret />
              </span>
            </div>
            <div className="wl-field">
              <select value={genre} onChange={(e) => onGenreChange(e.target.value)}>
                <option value="all">Genre · Any</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
              <span className="wl-field-caret">
                <IconCaret />
              </span>
            </div>
          </div>

          <div className="wl-side-grp">
            <div className="wl-side-label">Sort</div>
            <div className="wl-field">
              <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
                <option value="score">Score</option>
                <option value="title">Title</option>
                <option value="recent">Recently added</option>
              </select>
              <span className="wl-field-caret">
                <IconCaret />
              </span>
            </div>
          </div>
        </aside>

        {/* main */}
        <main className="wl-main">
          {watchlist.length === 0 ? (
            <div className="state">
              <div className="jp-big">空</div>
              <h3>Your watchlist is empty</h3>
              <p>Open any anime and use "Add to Watchlist" to start building your list.</p>
              <Link className="btn" to="/">
                Browse anime
              </Link>
            </div>
          ) : view.length === 0 ? (
            <div className="state">
              <div className="jp-big">該当なし</div>
              <h3>No titles match</h3>
              <p>Try clearing a filter.</p>
            </div>
          ) : (
            <WlTable title="Watching" jp="視聴中" items={view} />
          )}
        </main>
      </div>

      <footer className="foot">
        <div>© MMXXVI · Kyomei</div>
        <div className="jp">共鳴 — 響き合う物語の索引</div>
        <div>Saved locally</div>
      </footer>
    </div>
  );
}
