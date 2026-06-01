import type { CSSProperties } from 'react';
import type { Anime } from '../types/types';

interface PosterOrbitProps {
  posters: Anime[];
}

interface OrbitSlotStyle extends CSSProperties {
  '--i'?: number;
  '--n'?: number;
}

export function PosterOrbit({ posters }: PosterOrbitProps) {
  const list = posters && posters.length ? posters : [];
  const safe = (i: number) => list[i % list.length];

  const N = 6;

  if (list.length === 0) {
    return (
      <div className="orbit" aria-hidden="true">
        <div className="orbit-ring-line inner" />
        <div className="orbit-center">
          <span className="tick n" />
          <span className="tick e" />
          <span className="tick s" />
          <span className="tick w" />
          <span className="kanji">響</span>
        </div>
      </div>
    );
  }

  return (
    <div className="orbit" aria-hidden="true">
      <div className="orbit-ring-line inner" />

      <div className="orbit-ring inner">
        {Array.from({ length: N }).map((_, i) => {
          const a = safe(i);
          const style: OrbitSlotStyle = { '--i': i, '--n': N };
          return (
            <div className="orbit-poster" key={`p-${i}`} style={style}>
              {a?.image && <img src={a.image} alt="" loading="lazy" />}
            </div>
          );
        })}
      </div>

      <div className="orbit-center">
        <span className="tick n" />
        <span className="tick e" />
        <span className="tick s" />
        <span className="tick w" />
        <span className="kanji">響</span>
      </div>
    </div>
  );
}
