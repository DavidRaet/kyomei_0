import type { ReactNode } from 'react';

interface SectionProps {
  num: string;
  title: string;
  titleEm?: string;
  jp?: string;
  meta?: ReactNode;
  children?: ReactNode;
}

export function Section({ num, title, titleEm, jp, meta, children }: SectionProps) {
  return (
    <section className="section">
      <div className="section-hd">
        <div className="section-title">
          <span className="num">{num}</span>
          <h2>
            {title} {titleEm && <em>{titleEm}</em>}
            {jp && <span className="jp">{jp}</span>}
          </h2>
        </div>
        {meta && <div className="section-meta">{meta}</div>}
      </div>
      {children}
    </section>
  );
}
