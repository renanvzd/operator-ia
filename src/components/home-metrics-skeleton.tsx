function HomeMetricsSkeleton() {
  return (
    <div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
      <div className="h-4 w-32 animate-pulse bg-bg-surface" />
      <div className="h-1 w-1 rounded-full bg-border-primary" />
      <div className="h-4 w-28 animate-pulse bg-bg-surface" />
    </div>
  );
}

export { HomeMetricsSkeleton };
