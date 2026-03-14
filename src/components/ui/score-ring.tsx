import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

const scoreRing = twMerge(
  "relative flex items-center justify-center w-[180px] h-[180px]",
);

type ScoreRingProps = ComponentProps<"div"> & {
  score: number;
  maxScore?: number;
};

function ScoreRing({
  score,
  maxScore = 10,
  className,
  ...props
}: ScoreRingProps) {
  const percentage = (score / maxScore) * 100;
  const dashArray = 2 * Math.PI * 70;
  const dashOffset = dashArray - (percentage / 100) * dashArray;

  return (
    <div className={twMerge(scoreRing, className)} {...props}>
      <svg
        className="absolute w-full h-full -rotate-90"
        viewBox="0 0 180 180"
        aria-hidden="true"
      >
        <circle
          cx="90"
          cy="90"
          r="70"
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="4"
        />
        <circle
          cx="90"
          cy="90"
          r="70"
          fill="none"
          stroke="url(#gradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-green)" />
            <stop offset="35%" stopColor="var(--color-accent-amber)" />
            <stop offset="36%" stopColor="transparent" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex items-baseline gap-0.5">
        <span className="font-mono text-5xl font-bold text-text-primary leading-none">
          {score}
        </span>
        <span className="font-mono text-base text-text-tertiary">
          /{maxScore}
        </span>
      </div>
    </div>
  );
}

export { ScoreRing, scoreRing, type ScoreRingProps };
