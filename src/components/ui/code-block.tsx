import type { ComponentProps } from "react";
import type { BundledLanguage } from "shiki";
import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";
import { LANGUAGES, normalizeLanguage } from "@/lib/languages";

export interface CodeBlockProps extends ComponentProps<"div"> {
  code: string;
  lang: string;
}

export interface CodeBlockHeaderProps extends ComponentProps<"div"> {
  filename?: string;
}

function escapeHtml(code: string) {
  return code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function CodeBlock({ code, lang, className, ...props }: CodeBlockProps) {
  const normalizedLanguage = normalizeLanguage(lang) ?? "plaintext";
  const shikiLanguage = LANGUAGES[normalizedLanguage].shikiId;

  const html = shikiLanguage
    ? await codeToHtml(code, {
        lang: shikiLanguage as BundledLanguage,
        theme: "vesper",
      })
    : `<pre class="shiki vesper" style="background-color:#101010;color:#ffffff"><code>${escapeHtml(code)}</code></pre>`;

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
