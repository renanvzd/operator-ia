import { CodeBlock } from "@/components/ui/code-block";

type ResultCodePreviewProps = {
  code: string;
  language: "javascript" | "typescript" | "sql" | "json";
};

async function ResultCodePreview({ code, language }: ResultCodePreviewProps) {
  const lines = code.split("\n");
  let lineNumber = 0;

  return (
    <div className="overflow-hidden border border-border-primary bg-bg-input">
      <div className="grid grid-cols-[3rem_minmax(0,1fr)]">
        <div className="flex flex-col items-end gap-2 border-r border-border-primary bg-bg-surface px-3 py-4 font-mono text-xs text-text-tertiary">
          {lines.map((line) => {
            lineNumber += 1;

            return <span key={`line-${lineNumber}-${line}`}>{lineNumber}</span>;
          })}
        </div>
        <CodeBlock code={code} lang={language} className="border-0" />
      </div>
    </div>
  );
}

export { ResultCodePreview, type ResultCodePreviewProps };
