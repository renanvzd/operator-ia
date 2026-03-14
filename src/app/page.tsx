"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { CodeEditor } from "@/components/code-editor";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

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
  const [code, setCode] = useState(sampleCode);
  const [roastMode, setRoastMode] = useState(false);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] flex flex-col items-center px-10 py-8">
      <div className="flex flex-col items-center gap-8 w-full max-w-3xl">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="font-mono text-[36px] font-bold text-accent-green">
              $
            </span>
            <h1 className="font-mono text-[36px] font-bold text-text-primary">
              paste your code. get roasted.
            </h1>
          </div>
          <p className="font-mono text-sm text-text-secondary">
            {
              "// drop your code below and we'll rate it — brutally honest or full roast mode"
            }
          </p>
        </div>

        <CodeEditor
          value={code}
          onChange={setCode}
          className="w-full"
          placeholder="paste your code here..."
        />

        <div className="flex items-center justify-between w-full">
          <Toggle
            checked={roastMode}
            onCheckedChange={setRoastMode}
            label="roast mode"
          />
          <Button variant="primary" size="lg">
            roast_my_code
          </Button>
        </div>

        <div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
          <span>2,847 codes roasted</span>
          <span>·</span>
          <span>avg score: 4.2/10</span>
        </div>
      </div>

      <div className="mt-16 flex flex-col gap-6 w-full max-w-[960px]">
        <h2 className="font-mono text-[13px] text-text-tertiary">
          {"// the worst code on the internet, ranked by shame"}
        </h2>

        <div className="border border-border-primary">
          <div className="flex items-center h-10 px-5 bg-bg-surface border-b border-border-primary">
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
              className="flex items-center px-5 py-4 border-b border-border-primary last:border-b-0"
            >
              <span className="w-12 font-mono text-xs text-text-tertiary">
                {item.rank}
              </span>
              <span className="w-16 font-mono text-xs font-bold text-accent-red">
                {item.score}
              </span>
              <div className="flex-1 flex flex-col gap-0.5">
                {item.code.map((line) => (
                  <span
                    key={line}
                    className="font-mono text-xs text-text-primary truncate"
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
            className="font-mono text-xs text-text-tertiary hover:text-text-secondary transition-colors"
          >
            view_full_leaderboard &gt;&gt;
          </Link>
        </div>
      </div>
    </main>
  );
}
