import type { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import { tv } from "tailwind-variants";

const cardRoot = tv({
  base: ["border border-border-primary bg-bg-page p-5"],
});

const cardHeader = tv({
  base: ["flex items-center gap-2 mb-3"],
});

const cardTitle = tv({
  base: ["font-mono text-[13px] text-text-primary mb-2"],
});

const cardDescription = tv({
  base: ["font-mono text-xs text-text-secondary leading-relaxed"],
});

type CardRootProps = ComponentProps<"div">;
type CardHeaderProps = ComponentProps<"div">;
type CardTitleProps = ComponentProps<"h3">;
type CardDescriptionProps = ComponentProps<"p">;

function CardRoot({ className, ...props }: CardRootProps) {
  return <div className={twMerge(cardRoot({ className }))} {...props} />;
}

function CardHeader({ className, ...props }: CardHeaderProps) {
  return <div className={twMerge(cardHeader({ className }))} {...props} />;
}

function CardTitle({ className, ...props }: CardTitleProps) {
  return <h3 className={twMerge(cardTitle({ className }))} {...props} />;
}

function CardDescription({ className, ...props }: CardDescriptionProps) {
  return <p className={twMerge(cardDescription({ className }))} {...props} />;
}

export {
  CardDescription,
  type CardDescriptionProps,
  CardHeader,
  type CardHeaderProps,
  CardRoot,
  type CardRootProps,
  CardTitle,
  type CardTitleProps,
  cardDescription,
  cardHeader,
  cardRoot,
  cardTitle,
};
