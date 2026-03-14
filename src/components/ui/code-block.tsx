import { codeToHtml } from "shiki";
import type { BundledLanguage } from "shiki";

export interface CodeBlockProps {
  code: string;
  lang: BundledLanguage;
  filename?: string;
}

export async function CodeBlock({ code, lang, filename }: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang,
    theme: "vesper",
  });

  return (
    <div className="border border-border-primary bg-bg-input overflow-hidden w-[560px]">
      <div className="flex items-center gap-3 h-10 px-4 border-b border-border-primary">
        <span className="h-2.5 w-2.5 rounded-full bg-accent-red" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-amber" />
        <span className="h-2.5 w-2.5 rounded-full bg-accent-green" />
        <span className="flex-1" />
        {filename && (
          <span className="font-mono text-xs text-text-tertiary">
            {filename}
          </span>
        )}
      </div>
      <div
        className="font-mono text-[13px]"
        // biome-ignore lint/security: shiki returns safe HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
