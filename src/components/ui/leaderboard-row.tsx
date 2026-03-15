import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const leaderboardRow =
  "flex items-center gap-6 px-5 py-4 border-b border-border-primary";

type LeaderboardRowProps = ComponentProps<"div"> & {
  rank: string | number;
  score: string | number;
  codePreview: string;
  language: string;
};

function LeaderboardRow({
  rank,
  score,
  codePreview,
  language,
  className,
  ...props
}: LeaderboardRowProps) {
  return (
    <div className={twMerge(leaderboardRow, className)} {...props}>
      <span className="w-10 font-mono text-xs text-text-tertiary">#{rank}</span>
      <span className="w-[60px] font-mono text-[13px] font-bold text-accent-red">
        {score}
      </span>
      <span className="flex-1 font-mono text-xs text-text-secondary truncate">
        {codePreview}
      </span>
      <span className="w-[100px] font-mono text-xs text-text-tertiary">
        {language}
      </span>
    </div>
  );
}

export { LeaderboardRow, type LeaderboardRowProps, leaderboardRow };
