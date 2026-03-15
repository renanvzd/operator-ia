import type { Metadata } from "next";
import { cacheLife, cacheTag } from "next/cache";
import { notFound } from "next/navigation";
import { ResultAnalysisCard } from "@/components/result-analysis-card";
import { ResultCodePreview } from "@/components/result-code-preview";
import { Button } from "@/components/ui/button";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { caller } from "@/trpc/server";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

type ResultData = {
  id: string;
  score: number;
  verdict: string;
  quote: string;
  language: string;
  lineCount: number;
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

type RoastRecord = NonNullable<
  Awaited<ReturnType<typeof caller.roast.getById>>
>;

function buildDiffLines(code: string, suggestedFix: string | null) {
  const originalLines = code.split("\n");
  const improvedLines = (suggestedFix ?? code).split("\n");
  const maxLines = Math.max(originalLines.length, improvedLines.length);
  const diff: ResultData["diff"] = [];

  for (let index = 0; index < maxLines; index += 1) {
    const originalLine = originalLines[index];
    const improvedLine = improvedLines[index];

    if (originalLine === improvedLine) {
      if (originalLine !== undefined) {
        diff.push({ type: "context", code: originalLine });
      }
      continue;
    }

    if (originalLine !== undefined) {
      diff.push({ type: "removed", code: originalLine });
    }

    if (improvedLine !== undefined) {
      diff.push({ type: "added", code: improvedLine });
    }
  }

  return diff;
}

function mapRoastToResultData(roast: RoastRecord): ResultData {
  return {
    id: roast.id,
    score: roast.score,
    verdict: roast.verdict,
    quote:
      roast.roastQuote ??
      '"this code looks like it was written during a power outage... in 2005."',
    language: roast.language,
    lineCount: roast.lineCount,
    code: roast.code,
    issues: roast.analysisItems.map((item) => ({
      severity: item.severity,
      title: item.title,
      description: item.description,
    })),
    diff: buildDiffLines(roast.code, roast.suggestedFix),
  };
}

async function getCachedRoastResult(id: string) {
  "use cache";

  cacheLife("hours");
  cacheTag("roast-result", id);

  const roast = await caller.roast.getById({ id });

  if (!roast) {
    return null;
  }

  return mapRoastToResultData(roast);
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const result = await getCachedRoastResult(id);

  if (!result) {
    return {
      title: "Roast Result | devroast",
    };
  }

  return {
    title: `Roast Result ${result.id.slice(0, 8)} | devroast`,
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

export default async function RoastPage({ params }: PageProps) {
  const { id } = await params;
  const result = await getCachedRoastResult(id);

  if (!result) {
    notFound();
  }

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
              <span>{result.lineCount} lines</span>
              <span aria-hidden="true">&middot;</span>
              <span>ID: {result.id.slice(0, 8)}...</span>
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
