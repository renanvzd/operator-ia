"use client";

import { Collapsible } from "@base-ui/react/collapsible";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

const homeShameLeaderboardRowCollapsible =
  "border-b border-border-primary last:border-b-0";

type HomeShameLeaderboardRowCollapsibleProps = ComponentProps<"div"> & {
  rank: string | number;
  score: string | number;
  language: string;
  lineCount: number;
  shouldCollapse: boolean;
  codeBlock: ReactNode;
};

function ChevronIcon(props: ComponentProps<"svg">) {
  return (
    <svg viewBox="0 0 10 10" fill="none" aria-hidden="true" {...props}>
      <path
        d="M2 3.25 5 6.25 8 3.25"
        stroke="currentColor"
        strokeWidth="1.25"
      />
    </svg>
  );
}

function HomeShameLeaderboardRowCollapsible({
  rank,
  score,
  language,
  lineCount,
  shouldCollapse,
  codeBlock,
  className,
  ...props
}: HomeShameLeaderboardRowCollapsibleProps) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible.Root
      open={open}
      onOpenChange={setOpen}
      className={twMerge(homeShameLeaderboardRowCollapsible, className)}
      {...props}
    >
      <div className="grid gap-4 px-5 py-4 md:grid-cols-[2.5rem_3.75rem_minmax(0,1fr)_6rem_auto] md:items-start md:gap-6">
        <span className="font-mono text-xs text-text-tertiary">#{rank}</span>

        <span className="font-mono text-[13px] font-bold text-accent-red">
          {score}
        </span>

        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 font-mono text-[11px] text-text-tertiary md:hidden">
            <span className="text-text-secondary">{language}</span>
            <span aria-hidden="true">&middot;</span>
            <span>{lineCount} lines</span>
          </div>

          <div
            className={twMerge(
              "relative overflow-hidden transition-[max-height] duration-200 ease-out",
              shouldCollapse && !open ? "max-h-52" : "max-h-none",
            )}
          >
            {codeBlock}

            {shouldCollapse && !open ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-bg-input to-transparent" />
            ) : null}
          </div>
        </div>

        <div className="hidden font-mono text-xs md:flex md:flex-col md:items-start md:gap-1">
          <span className="text-text-secondary">{language}</span>
          <span className="text-text-tertiary">{lineCount} lines</span>
        </div>

        {shouldCollapse ? (
          <Collapsible.Trigger className="group inline-flex items-center justify-self-start gap-2 font-mono text-[11px] text-text-tertiary transition-colors hover:text-text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-green focus-visible:ring-offset-2 focus-visible:ring-offset-bg-page md:justify-self-end">
            <span>{open ? "hide_code" : "show_code"}</span>
            <ChevronIcon className="h-3 w-3 transition-transform duration-150 group-data-[panel-open]:rotate-180" />
          </Collapsible.Trigger>
        ) : (
          <span className="hidden md:block" aria-hidden="true" />
        )}
      </div>
    </Collapsible.Root>
  );
}

export {
  HomeShameLeaderboardRowCollapsible,
  type HomeShameLeaderboardRowCollapsibleProps,
  homeShameLeaderboardRowCollapsible,
};
