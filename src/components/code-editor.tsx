"use client";

import type { ComponentProps, UIEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { useShikiHighlighter } from "@/hooks/use-shiki-highlighter";
import { LANGUAGES, type SupportedLanguage } from "@/lib/languages";

const codeEditor = "overflow-hidden border border-border-primary bg-bg-input";

const codeEditorHeader =
  "flex h-10 items-center gap-2 border-b border-border-primary px-4";

const codeEditorBody = "flex h-[320px] min-h-0";

const codeEditorLineNumbers =
  "overflow-hidden border-r border-border-primary bg-bg-surface px-3 py-3 text-right font-mono text-xs leading-6 text-text-tertiary select-none";

const codeEditorSurface = "relative min-w-0 flex-1 overflow-hidden";

const codeEditorLayer =
  "col-start-1 row-start-1 overflow-auto p-3 font-mono text-xs leading-6 whitespace-pre";

type CodeEditorProps = Omit<
  ComponentProps<"textarea">,
  "onChange" | "value" | "children"
> & {
  value: string;
  language?: SupportedLanguage;
  statusLabel?: string;
  onChange?: (value: string) => void;
};

function escapeHtml(code: string) {
  return code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function CodeEditor({
  value,
  language = "plaintext",
  statusLabel,
  onChange,
  className,
  disabled,
  placeholder,
  ...props
}: CodeEditorProps) {
  const { highlight } = useShikiHighlighter();
  const [highlightedHtml, setHighlightedHtml] = useState(
    `<pre class="shiki vesper"><code>${escapeHtml(value)}</code></pre>`,
  );
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const lineCount = useMemo(() => {
    return Math.max(value.split("\n").length, 16);
  }, [value]);

  const lineNumbers = useMemo(() => {
    return Array.from({ length: lineCount }, (_, index) => index + 1);
  }, [lineCount]);

  useEffect(() => {
    let isCancelled = false;
    const timeout = window.setTimeout(async () => {
      const html = await highlight(value, language);
      const normalizedHtml = html.replace(
        /background-color:[^;"']+;?/g,
        "background-color:transparent;",
      );

      if (!isCancelled) {
        setHighlightedHtml(normalizedHtml);
      }
    }, 120);

    return () => {
      isCancelled = true;
      window.clearTimeout(timeout);
    };
  }, [highlight, language, value]);

  function handleScroll(event: UIEvent<HTMLTextAreaElement>) {
    const { scrollLeft, scrollTop } = event.currentTarget;

    if (highlightRef.current) {
      highlightRef.current.scrollLeft = scrollLeft;
      highlightRef.current.scrollTop = scrollTop;
    }

    if (lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = scrollTop;
    }
  }

  return (
    <div className={twMerge(codeEditor, className)}>
      <div className={codeEditorHeader}>
        <span className="h-3 w-3 rounded-full bg-accent-red" />
        <span className="h-3 w-3 rounded-full bg-accent-amber" />
        <span className="h-3 w-3 rounded-full bg-accent-green" />
        <span className="flex-1" />
        <span className="font-mono text-xs text-text-tertiary">
          {statusLabel ?? LANGUAGES[language].label}
        </span>
      </div>

      <div className={codeEditorBody}>
        <div ref={lineNumbersRef} className={codeEditorLineNumbers}>
          {lineNumbers.map((lineNumber) => (
            <div key={lineNumber}>{lineNumber}</div>
          ))}
        </div>

        <div className={codeEditorSurface}>
          {!value && placeholder ? (
            <div className="pointer-events-none absolute inset-0 z-10 p-3 font-mono text-xs leading-6 text-text-tertiary">
              {placeholder}
            </div>
          ) : null}

          <div className="grid h-full">
            <div
              ref={highlightRef}
              className={twMerge(
                codeEditorLayer,
                "code-editor-highlight text-text-primary",
              )}
              aria-hidden="true"
              // biome-ignore lint/security: shiki returns safe HTML for trusted local highlighting
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />

            <textarea
              ref={textareaRef}
              value={value}
              disabled={disabled}
              spellCheck={false}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              onScroll={handleScroll}
              onChange={(event) => onChange?.(event.target.value)}
              className={twMerge(
                codeEditorLayer,
                "z-10 resize-none border-none bg-transparent text-transparent caret-text-primary outline-none [tab-size:2] [-webkit-text-fill-color:transparent]",
                disabled ? "cursor-not-allowed" : "cursor-text",
              )}
              {...props}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export { CodeEditor, type CodeEditorProps, codeEditor };
