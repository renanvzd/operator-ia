import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const diffLine = tv({
  base: ["flex font-mono text-[13px]"],
  variants: {
    type: {
      removed: ["bg-diff-removed text-text-secondary"],
      added: ["bg-diff-added text-text-primary"],
      context: "text-text-secondary",
    },
  },
});

const diffLinePrefix = tv({
  base: ["w-4 font-mono text-[13px]"],
  variants: {
    type: {
      removed: "text-accent-red",
      added: "text-accent-green",
      context: "text-text-tertiary",
    },
  },
});

type DiffLineVariants = VariantProps<typeof diffLine>;
type DiffLineProps = ComponentProps<"div"> &
  DiffLineVariants & {
    code: string;
  };

function DiffLine({ type, code, className, ...props }: DiffLineProps) {
  const prefix = type === "removed" ? "-" : type === "added" ? "+" : " ";

  return (
    <div className={diffLine({ type, className })} {...props}>
      <span className={diffLinePrefix({ type })}>{prefix}</span>
      <span className="flex-1">{code}</span>
    </div>
  );
}

export {
  DiffLine,
  type DiffLineProps,
  type DiffLineVariants,
  diffLine,
  diffLinePrefix,
};
