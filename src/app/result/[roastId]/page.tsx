import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ResultAnalysisCard } from "@/components/result-analysis-card";
import { ResultCodePreview } from "@/components/result-code-preview";
import { Button } from "@/components/ui/button";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

type PageProps = {
  params: Promise<{
    roastId: string;
  }>;
};

type ResultData = {
  score: number;
  verdict: string;
  quote: string;
  language: "javascript" | "typescript" | "sql" | "json";
  code: string;
  issues: {
    severity: "critical" | "warning" | "good";
    title: string;
    description: string;
  }[];
  diff: {
    type: "removed" | "added" | "context";
    code: string;
  }[];
};

// const UUID_PATTERN =
//   /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const resultData: ResultData = {
  score: 3.5,
  verdict: "needs_serious_help",
  quote:
    '"this code looks like it was written during a power outage... in 2005."',
  language: "javascript",
  code: `function calculateTotal(items) {
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
}`,
  issues: [
    {
      severity: "critical",
      title: "using var instead of const/let",
      description:
        "`var` is function-scoped and harder to reason about. Modern JavaScript favors `const` for stable bindings and `let` for reassignment.",
    },
    {
      severity: "warning",
      title: "imperative loop pattern",
      description:
        "`for` loops are valid, but this accumulation reads better as a `reduce` and keeps the intent more obvious.",
    },
    {
      severity: "good",
      title: "clear early computation",
      description:
        "The discount rule is easy to spot quickly, which makes the happy path understandable even before refactoring.",
    },
    {
      severity: "good",
      title: "logic readability",
      description:
        "Even with some cleanup needed, the flow still follows a simple sequence: accumulate, apply discount, return result.",
    },
  ],
  diff: [
    {
      type: "context",
      code: "function calculateTotal(items) {",
    },
    {
      type: "removed",
      code: "  var total = 0;",
    },
    {
      type: "removed",
      code: "  for (var i = 0; i < items.length; i++) {",
    },
    {
      type: "removed",
      code: "    total = total + items[i].price;",
    },
    {
      type: "removed",
      code: "  }",
    },
    {
      type: "added",
      code: "  const total = items.reduce((sum, item) => sum + item.price, 0);",
    },
    {
      type: "context",
      code: "  return total;",
    },
    {
      type: "context",
      code: "}",
    },
  ],
};

// function isUuid(value: string) {
//   return UUID_PATTERN.test(value);
// }

async function getResultData(_roastId: string) {
  return resultData;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { roastId } = await params;

  // if (!isUuid(roastId)) {
  //   return {
  //     title: "Roast Result | devroast",
  //   };
  // }

  return {
    title: `Roast Result ${roastId.slice(0, 8)} | devroast`,
    description:
      "Server-rendered roast result with score breakdown, analysis cards, and suggested fixes.",
  };
}

function SectionTitle({ prompt, title }: { prompt: string; title: string }) {
  return (
    <div className="flex items-center gap-2 font-mono text-sm font-bold">
      <span className="text-accent-green">{"//"}</span>
      <h2 className="text-text-primary">{title}</h2>
      <span className="sr-only">{prompt}</span>
    </div>
  );
}

export default async function ResultPage({ params }: PageProps) {
  const { roastId } = await params;

  // if (!isUuid(roastId)) {
  //   notFound();
  // }

  const result = await getResultData(roastId);
  const lineCount = result.code.split("\n").length;

  return (
    <main className="min-h-[calc(100vh-3.5rem)]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-10 px-5 py-10 md:px-10 lg:px-20">
        <section className="flex flex-col gap-8 lg:flex-row lg:items-center">
          <ScoreRing score={result.score} className="shrink-0" />

          <div className="flex flex-1 flex-col gap-4">
            <div className="inline-flex w-fit items-center gap-2 font-mono text-[13px] text-accent-red">
              <span className="h-2 w-2 rounded-full bg-current" />
              <span>verdict: {result.verdict}</span>
            </div>

            <h1 className="max-w-4xl font-mono text-xl leading-relaxed text-text-primary md:text-[20px]">
              {result.quote}
            </h1>

            <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-text-tertiary">
              <span>lang: {result.language}</span>
              <span aria-hidden="true">&middot;</span>
              <span>{lineCount} lines</span>
              <span aria-hidden="true">&middot;</span>
              <span>ID: {roastId.slice(0, 8)}...</span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="secondary" size="sm" type="button">
                share_roast
              </Button>
              <Button variant="secondary" size="sm" type="button">
                copy_link
              </Button>
            </div>
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-4">
          <SectionTitle prompt="your submission" title="your_submission" />
          <ResultCodePreview code={result.code} language={result.language} />
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <SectionTitle prompt="detailed analysis" title="detailed_analysis" />
          <div className="grid gap-5 md:grid-cols-2">
            {result.issues.map((issue) => (
              <ResultAnalysisCard
                key={`${issue.severity}-${issue.title}`}
                severity={issue.severity}
                title={issue.title}
                description={issue.description}
              />
            ))}
          </div>
        </section>

        <div className="h-px w-full bg-border-primary" />

        <section className="flex flex-col gap-6">
          <SectionTitle prompt="suggested fix" title="suggested_fix" />

          <div className="overflow-hidden border border-border-primary bg-bg-input">
            <div className="flex h-10 items-center border-b border-border-primary px-4 font-mono text-xs font-medium text-text-secondary">
              your_code.ts -&gt; improved_code.ts
            </div>

            <div className="flex flex-col py-1">
              {result.diff.map((line) => (
                <DiffLine
                  key={`${line.type}-${line.code}`}
                  type={line.type}
                  code={line.code}
                  className="px-4 leading-7"
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
