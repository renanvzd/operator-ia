import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const badge = tv({
  base: ["inline-flex items-center gap-2 font-mono text-xs"],
  variants: {
    variant: {
      critical: "text-accent-red",
      warning: "text-accent-amber",
      good: "text-accent-green",
      verdict: "text-accent-red",
    },
  },
});

type BadgeVariants = VariantProps<typeof badge>;
type BadgeProps = ComponentProps<"div"> & BadgeVariants;

function Badge({ variant, className, ...props }: BadgeProps) {
  return (
    <div className={badge({ variant, className })} {...props}>
      <span className="h-2 w-2 rounded-full bg-current" />
    </div>
  );
}

export { Badge, type BadgeProps, type BadgeVariants, badge };
