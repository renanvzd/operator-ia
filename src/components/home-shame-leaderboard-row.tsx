import { HomeShameLeaderboardRowCollapsible } from "@/components/home-shame-leaderboard-row-collapsible";
import { CodeBlock } from "@/components/ui/code-block";
import { LANGUAGES, normalizeLanguage } from "@/lib/languages";

type HomeShameLeaderboardRowProps = {
  rank: number;
  score: string;
  language: string;
  code: string;
};

const COLLAPSED_PREVIEW_LINE_THRESHOLD = 5;

async function HomeShameLeaderboardRow({
  rank,
  score,
  language,
  code,
}: HomeShameLeaderboardRowProps) {
  const normalizedLanguage = normalizeLanguage(language) ?? "plaintext";
  const languageLabel = LANGUAGES[normalizedLanguage].label;
  const lineCount = code.split("\n").length;
  const shouldCollapse = lineCount > COLLAPSED_PREVIEW_LINE_THRESHOLD;

  return (
    <HomeShameLeaderboardRowCollapsible
      rank={rank}
      score={score}
      language={languageLabel}
      lineCount={lineCount}
      shouldCollapse={shouldCollapse}
      codeBlock={
        <CodeBlock code={code} lang={normalizedLanguage} className="w-full" />
      }
    />
  );
}

export { HomeShameLeaderboardRow, type HomeShameLeaderboardRowProps };
