import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { LeaderboardEntryCard } from "@/components/leaderboard-entry-card";
import { caller } from "@/trpc/server";

export const metadata: Metadata = {
  title: "Shame Leaderboard | devroast",
  description:
    "Browse the most roasted code submissions on devroast, rendered on the server for search-friendly leaderboard pages.",
};

export default async function LeaderboardPage() {
  "use cache";

  cacheLife("hours");

  const leaderboard = await caller.leaderboard.getLeaderboard({ limit: 20 });

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 py-10 md:px-10 lg:px-20">
        <section className="flex flex-col gap-4 border-border-primary">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-[32px] font-bold text-accent-green">
              &gt;
            </span>
            <h1 className="text-[28px] font-bold text-text-primary md:text-[32px]">
              shame_leaderboard
            </h1>
          </div>

          <p className="font-mono text-sm text-text-secondary">
            {"// the most roasted code on the internet"}
          </p>

          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-text-tertiary">
            <span>
              {leaderboard.totalRoasts.toLocaleString("en-US")} submissions
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>avg score: {leaderboard.avgScore.toFixed(1)}/10</span>
          </div>
        </section>

        <section
          className="flex flex-col gap-5"
          aria-label="Shame leaderboard entries"
        >
          {leaderboard.entries.map((entry) => (
            <LeaderboardEntryCard
              key={entry.id}
              rank={entry.rank}
              score={entry.score.toFixed(1)}
              language={entry.language}
              code={entry.code}
              lineCount={entry.lineCount}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
