function HomeShameLeaderboardSkeleton() {
  return (
    <section
      className="flex flex-col gap-6"
      aria-label="Loading shame leaderboard"
    >
      <div className="h-4 w-72 animate-pulse bg-bg-surface" />

      <div className="border border-border-primary">
        <div className="flex h-10 items-center border-b border-border-primary bg-bg-surface px-5">
          <div className="h-3 w-full animate-pulse bg-bg-page/0" />
        </div>

        {[1, 2, 3].map((item) => (
          <div
            key={`leaderboard-skeleton-${item}`}
            className="flex items-center gap-6 border-b border-border-primary px-5 py-4 last:border-b-0"
          >
            <div className="h-3 w-8 animate-pulse bg-bg-surface" />
            <div className="h-3 w-12 animate-pulse bg-bg-surface" />
            <div className="h-3 flex-1 animate-pulse bg-bg-surface" />
            <div className="h-3 w-20 animate-pulse bg-bg-surface" />
          </div>
        ))}

        <div className="flex flex-col gap-4 border-t border-border-primary px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2">
            <div className="h-3 w-24 animate-pulse bg-bg-surface" />
            <div className="h-1 w-1 rounded-full bg-border-primary" />
            <div className="h-3 w-20 animate-pulse bg-bg-surface" />
          </div>

          <div className="h-3 w-36 animate-pulse bg-bg-surface" />
        </div>
      </div>
    </section>
  );
}

export { HomeShameLeaderboardSkeleton };
