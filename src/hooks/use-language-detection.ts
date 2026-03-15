"use client";

import type { HLJSApi } from "highlight.js";
import { useEffect, useState } from "react";
import {
  DETECTION_LANGUAGE_KEYS,
  LANGUAGES,
  normalizeLanguage,
  type SupportedLanguage,
} from "@/lib/languages";

const DETECTION_DEBOUNCE_MS = 300;
const MIN_RELEVANCE = 5;

let highlightJsPromise: Promise<HLJSApi> | null = null;

async function getHighlightJs() {
  if (!highlightJsPromise) {
    highlightJsPromise = (async () => {
      const core = await import("highlight.js/lib/core");
      const hljs = core.default;

      await Promise.all(
        DETECTION_LANGUAGE_KEYS.map(async (key) => {
          const config = LANGUAGES[key];

          if (!config.highlightId || !config.highlightLoader) {
            return;
          }

          if (hljs.getLanguage(config.highlightId)) {
            return;
          }

          const language = await config.highlightLoader();
          hljs.registerLanguage(config.highlightId, language.default);
        }),
      );

      return hljs;
    })();
  }

  return highlightJsPromise;
}

type UseLanguageDetectionOptions = {
  enabled?: boolean;
};

function useLanguageDetection(
  code: string,
  options: UseLanguageDetectionOptions = {},
) {
  const { enabled = true } = options;
  const [detectedLanguage, setDetectedLanguage] =
    useState<SupportedLanguage | null>(null);
  const [confidence, setConfidence] = useState(0);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setDetectedLanguage(null);
      setConfidence(0);
      return;
    }

    const timeout = window.setTimeout(async () => {
      const hljs = await getHighlightJs();
      const subset = DETECTION_LANGUAGE_KEYS.flatMap((key) => {
        const config = LANGUAGES[key];
        return config.highlightId
          ? [config.highlightId, ...config.aliases]
          : [];
      });
      const result = hljs.highlightAuto(trimmedCode, subset);
      const normalizedLanguage = normalizeLanguage(result.language);

      if (!normalizedLanguage || result.relevance < MIN_RELEVANCE) {
        setDetectedLanguage(null);
        setConfidence(result.relevance ?? 0);
        return;
      }

      setDetectedLanguage(normalizedLanguage);
      setConfidence(result.relevance ?? 0);
    }, DETECTION_DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [code, enabled]);

  return {
    detectedLanguage,
    confidence,
  };
}

export { useLanguageDetection };
