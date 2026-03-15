import type { ComponentProps } from "react";
import { tv, type VariantProps } from "tailwind-variants";

const button = tv({
  base: [
    "inline-flex items-center justify-center font-mono transition-colors enabled:cursor-pointer disabled:cursor-not-allowed",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-accent-green",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  variants: {
    variant: {
      primary: [
        "bg-accent-green text-bg-page font-medium",
        "enabled:hover:bg-accent-green/90",
      ],
      secondary: [
        "border border-border-primary bg-transparent text-text-primary",
        "enabled:hover:bg-bg-elevated",
      ],
      link: [
        "border border-border-primary bg-transparent text-text-secondary",
        "enabled:hover:text-text-primary",
      ],
    },
    size: {
      sm: "px-3 py-1.5 text-xs gap-1",
      md: "px-4 py-2 text-xs gap-1.5",
      lg: "px-6 py-2.5 text-[13px] font-medium gap-2",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "md",
  },
});

type ButtonVariants = VariantProps<typeof button>;
type ButtonProps = ComponentProps<"button"> & ButtonVariants;

function Button({ variant, size, className, ...props }: ButtonProps) {
  return <button className={button({ variant, size, className })} {...props} />;
}

export { Button, type ButtonProps, type ButtonVariants, button };
