import type { ComponentProps } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

export interface CodeBlockProps extends ComponentProps<"div"> {
  code: string;
  lang: BundledLanguage;
}

export interface CodeBlockHeaderProps extends ComponentProps<"div"> {
  filename?: string;
}

async function CodeBlock({ code, lang, className, ...props }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <div
      className={twMerge(
        "overflow-hidden border border-border-primary bg-bg-input",
        className,
      )}
      {...props}
    >
      <div
        className="font-mono text-[13px]"
        // biome-ignore lint/security: shiki returns safe HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

function CodeBlockHeader({
  filename,
  className,
  ...props
}: CodeBlockHeaderProps) {
  return (
    <div
      className={twMerge(
        "flex h-10 items-center gap-3 border-b border-border-primary px-4",
        className,
      )}
      {...props}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
      <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
      <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
      <span className="flex-1" />
      {filename ? (
        <span className="font-mono text-xs text-text-tertiary">{filename}</span>
      ) : null}
    </div>
  );
}

export { CodeBlock, CodeBlockHeader };
