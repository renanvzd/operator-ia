import Link from "next/link";
import { Suspense } from "react";
import { HomeEditor } from "@/components/home-editor";
import { HomeMetrics } from "@/components/home-metrics";
import { HomeMetricsSkeleton } from "@/components/home-metrics-skeleton";
import { HydrateClient, prefetch, trpc } from "@/trpc/server";

const leaderboardData = [
  {
    rank: 1,
    score: "1.2",
    code: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    lang: "javascript",
  },
  {
    rank: 2,
    score: "1.8",
    code: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    lang: "typescript",
  },
  {
    rank: 3,
    score: "2.1",
    code: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    lang: "sql",
  },
];

export default function Home() {
  prefetch(trpc.roast.getStats.queryOptions());

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center px-10 py-8">
      <HomeEditor />

      <HydrateClient>
        <Suspense fallback={<HomeMetricsSkeleton />}>
          <div className="mt-6 flex w-full max-w-3xl justify-center md:justify-start">
            <HomeMetrics />
          </div>
        </Suspense>
      </HydrateClient>

      <div className="mt-16 flex w-full max-w-[960px] flex-col gap-6">
        <h2 className="font-mono text-[13px] text-text-tertiary">
          {"// the worst code on the internet, ranked by shame"}
        </h2>

        <div className="border border-border-primary">
          <div className="flex h-10 items-center border-b border-border-primary bg-bg-surface px-5">
            <span className="w-12 font-mono text-xs font-medium text-text-tertiary">
              #
            </span>
            <span className="w-16 font-mono text-xs font-medium text-text-tertiary">
              score
            </span>
            <span className="flex-1 font-mono text-xs font-medium text-text-tertiary">
              code
            </span>
            <span className="w-24 font-mono text-xs font-medium text-text-tertiary">
              lang
            </span>
          </div>

          {leaderboardData.map((item) => (
            <div
              key={item.rank}
              className="flex items-center border-b border-border-primary px-5 py-4 last:border-b-0"
            >
              <span className="w-12 font-mono text-xs text-text-tertiary">
                {item.rank}
              </span>
              <span className="w-16 font-mono text-xs font-bold text-accent-red">
                {item.score}
              </span>
              <div className="flex flex-1 flex-col gap-0.5">
                {item.code.map((line) => (
                  <span
                    key={line}
                    className="truncate font-mono text-xs text-text-primary"
                  >
                    {line}
                  </span>
                ))}
              </div>
              <span className="w-24 font-mono text-xs text-text-secondary">
                {item.lang}
              </span>
            </div>
          ))}
        </div>

        <div className="flex justify-center py-4">
          <Link
            href="/leaderboard"
            className="font-mono text-xs text-text-tertiary transition-colors hover:text-text-secondary"
          >
            view_full_leaderboard &gt;&gt;
          </Link>
        </div>
      </div>
    </main>
  );
}
