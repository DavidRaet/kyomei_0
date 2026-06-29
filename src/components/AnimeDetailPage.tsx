// TODO: import { useParams } from 'react-router-dom';
// TODO: import { useState, useEffect } from 'react';
import type { AnimeDetail, CharacterEntry } from '../types/anime-detail';
import { ErrorState } from './ErrorState';
import { IconStar } from './icons';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
// ── helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function cap(s: string | null | undefined): string | null {
  if (!s) return null;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function bannerOf(a: AnimeDetail): string | null {
  return a.trailer?.images?.maximum_image_url || a.trailer?.images?.large_image_url || null;
}

// ── sub-components ────────────────────────────────────────────────────────────

function MetaItem({ label, value }: { label: string; value: string | number | null | undefined }) {
  return (
    <div className="d-meta-item">
      <div className="d-meta-label">{label}</div>
      <div className="d-meta-value">{value || '—'}</div>
    </div>
  );
}

function CharCard({ entry }: { entry: CharacterEntry }) {
  const ch = entry.character;
  const va =
    entry.voice_actors.find((v) => v.language === 'Japanese') || entry.voice_actors[0];
  const chImg = ch.images.webp.image_url || ch.images.jpg.image_url;
  const vaImg = va?.person.images.jpg.image_url ?? '';

  return (
    <div className="d-char">
      <div className="d-char-side left">
        <div className="d-char-thumb">
          {chImg && <img src={chImg} alt={ch.name} loading="lazy" />}
        </div>
        <div className="d-char-text">
          <div className="d-char-name">{ch.name}</div>
          <div className="d-char-role">{entry.role}</div>
        </div>
      </div>
      {va && (
        <div className="d-char-side right">
          <div className="d-char-text r">
            <div className="d-char-name">{va.person.name}</div>
            <div className="d-char-role">{va.language}</div>
          </div>
          <div className="d-char-thumb">
            {vaImg && <img src={vaImg} alt={va.person.name} loading="lazy" />}
          </div>
        </div>
      )}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="detail">
      <div className="d-banner skeleton" />
      <div className="d-head">
        <div className="skeleton" style={{ width: 220, aspectRatio: '2/3', borderRadius: 6 }} />
        <div style={{ flex: 1, paddingTop: 24 }}>
          <div className="skeleton sk-line" style={{ width: '55%', height: 28 }} />
          <div className="skeleton sk-line w-40" style={{ height: 14, marginTop: 18 }} />
          <div className="skeleton sk-line w-60" style={{ height: 12, marginTop: 14 }} />
        </div>
      </div>
    </div>
  );
}



// ── placeholder data (remove once state is wired) ─────────────────────────────

const MOCK_DETAIL: AnimeDetail = {
  mal_id: 52991,
  title: 'Sousou no Frieren',
  title_english: "Frieren: Beyond Journey's End",
  title_japanese: '葬送のフリーレン',
  images: {
    jpg: {
      image_url: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
      large_image_url: 'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg',
    },
    webp: {
      image_url: 'https://cdn.myanimelist.net/images/anime/1015/138006.webp',
      large_image_url: 'https://cdn.myanimelist.net/images/anime/1015/138006l.webp',
    },
  },
  score: 9.38,
  episodes: 28,
  synopsis:
    "The adventure is over but life goes on for an elf mage just beginning to learn what living is all about. Elf mage Frieren and her courageous fellow adventurers have defeated the Demon King and brought peace to the land. But Frieren will long outlive the rest of her mortal companions. How does the longest-lived feel about time and what does the experience of a hundred thousand years really mean?",
  genres: [
    { mal_id: 2, name: 'Adventure' },
    { mal_id: 8, name: 'Drama' },
    { mal_id: 10, name: 'Fantasy' },
  ],
  trailer: null,
  status: 'Finished Airing',
  rating: 'PG-13',
  type: 'TV',
  duration: '23 min per ep',
  aired: { from: '2023-09-29T00:00:00+00:00', to: '2024-03-22T00:00:00+00:00' },
  season: 'fall',
  year: 2023,
  studios: [{ mal_id: 1003, name: 'Madhouse' }],
};

const MOCK_CHARS: CharacterEntry[] = [
  {
    character: {
      mal_id: 117236,
      name: 'Frieren',
      images: { jpg: { image_url: '' }, webp: { image_url: '' } },
    },
    role: 'Main',
    favorites: 50000,
    voice_actors: [
      { language: 'Japanese', person: { name: 'Ichinose, Kana', images: { jpg: { image_url: '' } } } },
    ],
  },
  {
    character: {
      mal_id: 167323,
      name: 'Stark',
      images: { jpg: { image_url: '' }, webp: { image_url: '' } },
    },
    role: 'Main',
    favorites: 20000,
    voice_actors: [
      { language: 'Japanese', person: { name: 'Kobayashi, Chiaki', images: { jpg: { image_url: '' } } } },
    ],
  },
  {
    character: {
      mal_id: 121974,
      name: 'Himmel',
      images: { jpg: { image_url: '' }, webp: { image_url: '' } },
    },
    role: 'Supporting',
    favorites: 15000,
    voice_actors: [
      { language: 'Japanese', person: { name: 'Okitsu, Kazuyuki', images: { jpg: { image_url: '' } } } },
    ],
  },
  {
    character: {
      mal_id: 121975,
      name: 'Heiter',
      images: { jpg: { image_url: '' }, webp: { image_url: '' } },
    },
    role: 'Supporting',
    favorites: 12000,
    voice_actors: [
      { language: 'Japanese', person: { name: 'Miyake, Kenta', images: { jpg: { image_url: '' } } } },
    ],
  },
];



// ── main component ────────────────────────────────────────────────────────────

export function AnimeDetailPage() {
  const { id } = useParams<{ id: string }>();
  // TODO: add useState and useEffect to fetch anime details and characters from the API using the id param

  // Replace ↓ with state once hooks are wired
  const fetchStatus: string = 'success'; // TODO: replace with useState<'loading' | 'error' | 'success'>
  const detail: AnimeDetail = MOCK_DETAIL; // TODO: replace with useState<AnimeDetail | null>
  const chars: CharacterEntry[] | null = MOCK_CHARS; // TODO: replace with useState<CharacterEntry[] | null>

  if (fetchStatus === 'success') return <DetailSkeleton />;
  if (fetchStatus === 'error') {
    return <ErrorState message="Could not load anime details." onRetry={() => { }} />;
  }

  const cover = detail.images.webp.large_image_url || detail.images.jpg.large_image_url;
  const banner = bannerOf(detail);
  const studio = detail.studios.map((s) => s.name).join(', ');
  const title = detail.title_english || detail.title;

  const sortedChars = (chars ?? [])
    .slice()
    .sort((a, b) => {
      const roleWeight = (r: string) => (r === 'Main' ? 0 : 1);
      const roleOrder = roleWeight(a.role) - roleWeight(b.role);
      if (roleOrder !== 0) return roleOrder;
      return (b.favorites || 0) - (a.favorites || 0);
    });

  const seasonValue = detail.season
    ? `${cap(detail.season) ?? detail.season} ${detail.year ?? ''}`.trim()
    : detail.year != null
      ? String(detail.year)
      : null;

  return (
    <div className="detail">
      {/* Top bar */}
      <header className="topbar d-topbar">
        <div className="brand">
          <button className="d-back" aria-label="Back to browse">
            {/* TODO: wrap in <Link to="/"> or call navigate(-1) via useNavigate() */}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="brand-mark">Kyomei</div>
          <div className="brand-jp">共鳴</div>
        </div>
        <nav className="nav">
          {/* TODO: replace with <Link to="/">Browse</Link> */}
          <a href="/">Browse</a>
        </nav>
        <div className="top-meta">
          <span className="dot" />
          <span>Live · Jikan</span>
        </div>
      </header>

      {/* Banner — trailer thumbnail or blurred cover fallback */}
      <div
        className="d-banner"
        style={banner ? { backgroundImage: `url(${banner})` } : {}}
      >
        <div className="d-banner-veil" />
        {!banner && cover && (
          <div
            className="d-banner-fallback"
            style={{ backgroundImage: `url(${cover})` }}
          />
        )}
      </div>

      {/* Header: large cover + title block */}
      <div className="d-head">
        <div className="d-cover">
          {cover && <img src={cover} alt={title} />}
          {detail.score ? (
            <div className="score d-score">
              <IconStar /> {detail.score.toFixed(1)}
            </div>
          ) : null}
        </div>
        <div className="d-head-text">
          <div className="d-eyebrow">
            <span className="dot" />
            {detail.genres.slice(0, 3).map((g) => g.name).join(' · ') || 'Anime'}
          </div>
          <h1 className="d-title">{title}</h1>
          {detail.title_japanese && (
            <div className="d-title-jp">{detail.title_japanese}</div>
          )}
          {detail.synopsis && <p className="d-synopsis">{detail.synopsis}</p>}
        </div>
      </div>

      {/* Two-column body */}
      <div className="d-body">
        {/* LEFT — info sidebar */}
        <aside className="d-side">
          <div className="d-side-title">
            Information<span className="jp">情報</span>
          </div>
          <MetaItem label="Studio" value={studio} />
          <MetaItem label="Format" value={detail.type} />
          <MetaItem label="Episodes" value={detail.episodes} />
          <MetaItem label="Episode Duration" value={detail.duration} />
          <MetaItem label="Status" value={detail.status} />
          <MetaItem label="Start Date" value={fmtDate(detail.aired?.from)} />
          <MetaItem label="End Date" value={fmtDate(detail.aired?.to)} />
          <MetaItem label="Season" value={seasonValue} />
        </aside>

        {/* RIGHT — characters */}
        <section className="d-main">
          <div className="section-title d-sec-hd">
            <span className="num">◆</span>
            <h2>
              Characters <span className="jp">登場人物</span>
            </h2>
          </div>

          {chars === null ? (
            <div className="d-char-grid">
              {Array.from({ length: 6 }).map((_, i) => (
                <div className="d-char skeleton" key={i} style={{ height: 88 }} />
              ))}
            </div>
          ) : sortedChars.length === 0 ? (
            <div className="state" style={{ margin: '8px 0' }}>
              <div className="jp-big">空</div>
              <h3>No cast listed</h3>
              <p>This title doesn't have character data in the catalogue yet.</p>
            </div>
          ) : (
            <div className="d-char-grid">
              {sortedChars.slice(0, 12).map((entry) => (
                <CharCard key={entry.character.mal_id} entry={entry} />
              ))}
            </div>
          )}
        </section>
      </div>

      <footer className="foot">
        <div>© MMXXVI · Kyomei</div>
        <div className="jp">共鳴 — 響き合う物語の索引</div>
        <div>Powered by Jikan / MAL</div>
      </footer>
    </div>
  );
}
