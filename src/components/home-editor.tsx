"use client";

import { useMemo, useState } from "react";
import { CodeEditor } from "@/components/code-editor";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { useLanguageDetection } from "@/hooks/use-language-detection";
import {
  LANGUAGE_OPTIONS,
  LANGUAGES,
  type SupportedLanguage,
} from "@/lib/languages";

const sampleCode = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  if (total > 100) {
    console.log("discount applied");
    total = total * 0.9;
  }
  // TODO: handle tax calculation
  // TODO: handle currency conversion
  return total;
}`;

function HomeEditor() {
  const [code, setCode] = useState(sampleCode);
  const [roastMode, setRoastMode] = useState(false);
  const [manualLanguage, setManualLanguage] =
    useState<SupportedLanguage | null>(null);
  const { detectedLanguage } = useLanguageDetection(code, {
    enabled: manualLanguage === null,
  });

  const currentLanguage = manualLanguage ?? detectedLanguage ?? "plaintext";
  const languageStatusLabel = useMemo(() => {
    const source = manualLanguage ? "manual" : "auto";
    return `${LANGUAGES[currentLanguage].label} · ${source}`;
  }, [currentLanguage, manualLanguage]);

  return (
    <div className="flex w-full max-w-3xl flex-col items-center gap-8">
      <div className="flex flex-col gap-3 self-start">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[36px] font-bold text-accent-green">
            $
          </span>
          <h1 className="font-mono text-[36px] font-bold text-text-primary">
            paste your code. get roasted.
          </h1>
        </div>
        <p className="font-mono text-sm text-text-secondary">
          {
            "// drop your code below and we'll rate it — brutally honest or full roast mode"
          }
        </p>
      </div>

      <CodeEditor
        value={code}
        onChange={setCode}
        className="w-full"
        language={currentLanguage}
        statusLabel={languageStatusLabel}
        placeholder="paste your code here..."
        aria-label="Code editor"
      />

      <div className="flex w-full flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Toggle
            checked={roastMode}
            onCheckedChange={setRoastMode}
            label="roast mode"
          />

          <label className="flex items-center gap-2 font-mono text-xs text-text-secondary">
            <span>language</span>
            <select
              value={manualLanguage ?? "auto"}
              onChange={(event) => {
                const value = event.target.value;
                setManualLanguage(
                  value === "auto" ? null : (value as SupportedLanguage),
                );
              }}
              className="h-9 border border-border-primary bg-bg-surface px-3 font-mono text-xs text-text-primary outline-none transition-colors focus:border-border-focus"
            >
              <option value="auto">auto detect</option>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <Button variant="primary" size="lg" disabled={!code.trim()}>
          roast_my_code
        </Button>
      </div>

      <div className="flex items-center gap-6 font-mono text-xs text-text-tertiary">
        <span>2,847 codes roasted</span>
        <span>·</span>
        <span>avg score: 4.2/10</span>
      </div>
    </div>
  );
}

export { HomeEditor };
