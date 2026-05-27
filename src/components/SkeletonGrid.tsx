interface SkeletonGridProps {
  count?: number;
}

export function SkeletonGrid({ count = 12 }: SkeletonGridProps) {
  return (
    <div className="grid grid-6">
      {Array.from({ length: count }).map((_, i) => (
        <div className="card" key={i}>
          <div className="skeleton sk-poster" />
          <div className="skeleton sk-line w-60" />
          <div className="skeleton sk-line w-40" />
        </div>
      ))}
    </div>
  );
}
