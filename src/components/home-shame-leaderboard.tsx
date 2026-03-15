import { cacheLife } from "next/cache";
import Link from "next/link";
import { HomeShameLeaderboardRow } from "@/components/home-shame-leaderboard-row";
import { caller } from "@/trpc/server";

async function HomeShameLeaderboard() {
  "use cache";

  cacheLife("hours");

  const leaderboard = await caller.leaderboard.getLeaderboard();

  return (
    <section className="flex flex-col gap-6" aria-label="Shame leaderboard">
      <h2 className="font-mono text-[13px] text-text-tertiary">
        {"// the worst code on the internet, ranked by shame"}
      </h2>

      <div className="border border-border-primary">
        <div className="flex h-10 items-center border-b border-border-primary bg-bg-surface px-5">
          <span className="w-10 font-mono text-xs font-medium text-text-tertiary">
            #
          </span>
          <span className="w-[60px] font-mono text-xs font-medium text-text-tertiary">
            score
          </span>
          <span className="flex-1 font-mono text-xs font-medium text-text-tertiary">
            code
          </span>
          <span className="w-[100px] font-mono text-xs font-medium text-text-tertiary">
            lang
          </span>
        </div>

        {leaderboard.entries.map((entry) => (
          <HomeShameLeaderboardRow
            key={entry.id}
            rank={entry.rank}
            score={entry.score.toFixed(1)}
            language={entry.language}
            code={entry.code}
          />
        ))}

        <div className="flex flex-col gap-4 border-t border-border-primary px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs text-text-tertiary">
            <span>
              {leaderboard.totalRoasts.toLocaleString("en-US")} total roasts
            </span>
            <span aria-hidden="true">&middot;</span>
            <span>avg score: {leaderboard.avgScore.toFixed(1)}/10</span>
          </div>

          <Link
            href="/leaderboard"
            className="font-mono text-xs text-text-tertiary transition-colors hover:text-text-secondary"
          >
            view_full_leaderboard &gt;&gt;
          </Link>
        </div>
      </div>
    </section>
  );
}

export { HomeShameLeaderboard };
