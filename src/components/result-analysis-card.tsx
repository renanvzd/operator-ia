import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { Badge, type BadgeProps } from "@/components/ui/badge";

type ResultAnalysisCardProps = ComponentProps<"article"> & {
  severity: NonNullable<BadgeProps["variant"]>;
  title: string;
  description: string;
};

function ResultAnalysisCard({
  severity,
  title,
  description,
  className,
  ...props
}: ResultAnalysisCardProps) {
  return (
    <article
      className={twMerge(
        "flex h-full flex-col gap-3 border border-border-primary p-5",
        className,
      )}
      {...props}
    >
      <Badge variant={severity}>{severity}</Badge>
      <h3 className="font-mono text-[13px] font-medium text-text-primary">
        {title}
      </h3>
      <p className="font-mono text-xs leading-relaxed text-text-secondary">
        {description}
      </p>
    </article>
  );
}

export { ResultAnalysisCard, type ResultAnalysisCardProps };
