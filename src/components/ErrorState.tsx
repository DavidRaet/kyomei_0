interface ErrorStateProps {
  message?: string | null;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="state">
      <div className="jp-big">圏外</div>
      <h3>Signal lost</h3>
      <p>
        {message ||
          "We can't reach the catalogue right now. Check your connection and try again."}
      </p>
      <button className="btn" onClick={onRetry}>
        Retry
      </button>
    </div>
  );
}
