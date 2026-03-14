import { useId } from "react";
import { twMerge } from "tailwind-merge";

const codeEditor = "border border-border-primary bg-bg-input overflow-hidden";

const codeEditorHeader =
  "flex items-center gap-2 h-10 px-4 border-b border-border-primary";

const codeEditorLineNumbers =
  "flex flex-col items-end gap-2 py-3 px-3 bg-bg-surface border-r border-border-primary text-xs font-mono text-text-tertiary";

const codeEditorTextarea =
  "flex-1 bg-transparent font-mono text-xs text-text-primary resize-none focus:outline-none placeholder:text-text-tertiary";

interface CodeEditorProps {
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  className?: string;
  disabled?: boolean;
}

function CodeEditor({
  value = "",
  placeholder,
  onChange,
  className,
  disabled,
}: CodeEditorProps) {
  const id = useId();
  const lineCount = value.split("\n").length || 1;
  const lines = Array.from(
    { length: Math.max(lineCount, 16) },
    (_, i) => i + 1,
  );

  return (
    <div className={twMerge(codeEditor, className)}>
      <div className={codeEditorHeader}>
        <span className="h-3 w-3 rounded-full bg-accent-red" />
        <span className="h-3 w-3 rounded-full bg-accent-amber" />
        <span className="h-3 w-3 rounded-full bg-accent-green" />
      </div>
      <div className="flex h-[320px]">
        <div className={codeEditorLineNumbers}>
          {lines.map((num) => (
            <span key={num}>{num}</span>
          ))}
        </div>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={twMerge(codeEditorTextarea, "p-3")}
          spellCheck={false}
        />
      </div>
    </div>
  );
}

export { CodeEditor, codeEditor };
