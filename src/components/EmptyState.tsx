interface EmptyStateProps {
  query: string;
  onReset: () => void;
}

export function EmptyState({ query, onReset }: EmptyStateProps) {
  return (
    <div className="state">
      <div className="jp-big">無</div>
      <h3>No resonance found</h3>
      <p>
        We couldn't find anything for{' '}
        <span style={{ color: 'var(--violet-200)' }}>"{query}"</span>. Try a broader title,
        romanized form, or browse trending below.
      </p>
      <button className="btn" onClick={onReset}>
        Clear search
      </button>
    </div>
  );
}
