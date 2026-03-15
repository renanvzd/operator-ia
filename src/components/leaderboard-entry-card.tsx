import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { CodeBlock } from "@/components/ui/code-block";
import { normalizeLanguage } from "@/lib/languages";

type LeaderboardEntryCardProps = ComponentProps<"article"> & {
  rank: number;
  score: string;
  language: string;
  code: string;
  lineCount?: number;
};

async function LeaderboardEntryCard({
  rank,
  score,
  language,
  code,
  lineCount,
  className,
  ...props
}: LeaderboardEntryCardProps) {
  const normalizedLanguage = normalizeLanguage(language) ?? "plaintext";
  const resolvedLineCount = lineCount ?? code.split("\n").length;

  return (
    <article
      className={twMerge("border border-border-primary", className)}
      {...props}
    >
      <header className="flex flex-col gap-3 border-b border-border-primary px-4 py-3 md:h-12 md:flex-row md:items-center md:justify-between md:px-5 md:py-0">
        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div className="flex items-center gap-1.5 font-mono text-[13px]">
            <span className="text-text-tertiary">#</span>
            <span className="font-bold text-accent-amber">{rank}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-text-tertiary">score:</span>
            <span className="text-[13px] font-bold text-accent-red">
              {score}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
          <span className="text-text-secondary">{language}</span>
          <span className="text-text-tertiary">{resolvedLineCount} lines</span>
        </div>
      </header>

      <CodeBlock
        code={code}
        lang={normalizedLanguage}
        className="w-full border-0"
      />
    </article>
  );
}

export { LeaderboardEntryCard, type LeaderboardEntryCardProps };
