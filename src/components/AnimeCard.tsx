import { useRef } from 'react';
import type { MouseEvent } from 'react';
import type { Anime, CardVariant } from '../types';
import { IconStar } from './icons';

interface AnimeCardProps {
  anime: Anime;
  variant: CardVariant;
  index: number;
}

export function AnimeCard({ anime, variant, index }: AnimeCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    const inner = el.querySelector<HTMLDivElement>('.card-inner');
    if (inner) {
      inner.style.transform = `rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg) translateZ(0)`;
    }
  };

  const onLeave = () => {
    const inner = ref.current?.querySelector<HTMLDivElement>('.card-inner');
    if (inner) inner.style.transform = 'rotateX(0) rotateY(0)';
  };

  const sub = (
    <div className="sub">
      {anime.episodes ? <span>{anime.episodes} ep</span> : <span>—</span>}
      <span className="sep" />
      <span>{anime.type || 'TV'}</span>
      {anime.year && (
        <>
          <span className="sep" />
          <span>{anime.year}</span>
        </>
      )}
    </div>
  );

  return (
    <div className="card" ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}>
      <div className="card-inner">
        {variant === 'minimal' ? (
          <div className="v-minimal">
            <div className="poster">
              {anime.image && <img src={anime.image} alt={anime.titleEnglish} loading="lazy" />}
              {anime.score ? (
                <div className="score">
                  <IconStar /> {anime.score.toFixed(1)}
                </div>
              ) : null}
              <div className="type-pill">{anime.type || 'TV'}</div>
              <div className="overlay">
                <h3 className="title">{anime.titleEnglish}</h3>
              </div>
            </div>
          </div>
        ) : variant === 'editorial' ? (
          <div className="v-editorial">
            <div className="poster">
              {anime.image && <img src={anime.image} alt={anime.titleEnglish} loading="lazy" />}
              {anime.score ? (
                <div className="score">
                  <IconStar /> {anime.score.toFixed(1)}
                </div>
              ) : null}
            </div>
            <div className="meta">
              <span className="idx">№ {String(index + 1).padStart(2, '0')}</span>
              <div className="eyebrow">
                <span className="dot" />
                {anime.genres?.[0] || anime.type || 'Anime'}
              </div>
              <h3 className="title">{anime.titleEnglish}</h3>
              <div className="sub">
                <span>{anime.episodes ? `${anime.episodes} ep` : '—'}</span>
                <span className="sep" />
                <span>{anime.year || anime.season || '—'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="v-poster">
            <div className="poster">
              {anime.image && <img src={anime.image} alt={anime.titleEnglish} loading="lazy" />}
              {anime.score ? (
                <div className="score">
                  <IconStar /> {anime.score.toFixed(1)}
                </div>
              ) : null}
              <div className="type-pill">{anime.type || 'TV'}</div>
            </div>
            <div className="meta">
              <h3 className="title">{anime.titleEnglish}</h3>
              {sub}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
