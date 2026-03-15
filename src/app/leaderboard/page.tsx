import type { Metadata } from "next";
import { LeaderboardEntryCard } from "@/components/leaderboard-entry-card";

type LeaderboardEntry = {
  rank: number;
  score: string;
  language: "javascript" | "typescript" | "sql" | "json";
  code: string;
};

export const metadata: Metadata = {
  title: "Shame Leaderboard | devroast",
  description:
    "Browse the most roasted code submissions on devroast, rendered on the server for search-friendly leaderboard pages.",
};

const leaderboardEntries: LeaderboardEntry[] = [
  {
    rank: 1,
    score: "1.2",
    language: "javascript",
    code: 'eval(prompt("enter code"))\ndocument.write(response)\n// trust the user lol',
  },
  {
    rank: 2,
    score: "1.8",
    language: "typescript",
    code: "if (x == true) { return true; }\nelse if (x == false) { return false; }\nelse { return !false; }",
  },
  {
    rank: 3,
    score: "2.1",
    language: "sql",
    code: "SELECT * FROM users WHERE 1=1\n-- TODO: add authentication",
  },
  {
    rank: 4,
    score: "2.8",
    language: "json",
    code: '{ "admin": true,\n  "password": "123456"\n}',
  },
  {
    rank: 5,
    score: "3.6",
    language: "javascript",
    code: "const retry = () => {\n  setTimeout(retry, 0);\n}",
  },
];

async function getLeaderboardEntries() {
  return leaderboardEntries;
}

export default async function LeaderboardPage() {
  const entries = await getLeaderboardEntries();

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
            <span>2,847 submissions</span>
            <span aria-hidden="true">&middot;</span>
            <span>avg score: 4.2/10</span>
          </div>
        </section>

        <section
          className="flex flex-col gap-5"
          aria-label="Shame leaderboard entries"
        >
          {entries.map((entry) => (
            <LeaderboardEntryCard
              key={entry.rank}
              rank={entry.rank}
              score={entry.score}
              language={entry.language}
              code={entry.code}
            />
          ))}
        </section>
      </div>
    </main>
  );
}
