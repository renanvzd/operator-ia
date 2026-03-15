"use client";

import { useCallback, useEffect, useState } from "react";
import {
  LANGUAGES,
  normalizeLanguage,
  type SupportedLanguage,
} from "@/lib/languages";

const THEME_NAME = "vesper";
const INITIAL_LANGUAGES: SupportedLanguage[] = [
  "javascript",
  "typescript",
  "json",
];

type ShikiHighlighter = {
  codeToHtml: (
    code: string,
    options: { lang: string; theme: string },
  ) => string;
  loadLanguage: (language: unknown) => Promise<void>;
  getLoadedLanguages: () => string[];
};

let highlighterPromise: Promise<ShikiHighlighter> | null = null;
const loadedLanguages = new Set<string>();

function escapeHtml(code: string) {
  return code
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

async function createSingletonHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = (async () => {
      const [
        { createHighlighterCore },
        { createJavaScriptRegexEngine },
        theme,
        ...langs
      ] = await Promise.all([
        import("shiki/core"),
        import("shiki/engine/javascript"),
        import("shiki/themes/vesper.mjs"),
        ...INITIAL_LANGUAGES.map(async (language) => {
          const loader = LANGUAGES[language].shikiLoader;
          return loader ? loader() : null;
        }),
      ]);

      const highlighter = await createHighlighterCore({
        themes: [theme.default as never],
        langs: langs
          .filter((lang): lang is { default: unknown } => Boolean(lang))
          .map((lang) => lang.default as never),
        engine: createJavaScriptRegexEngine({ forgiving: true }),
      });

      for (const language of INITIAL_LANGUAGES) {
        const shikiId = LANGUAGES[language].shikiId;

        if (shikiId) {
          loadedLanguages.add(shikiId);
        }
      }

      return highlighter as ShikiHighlighter;
    })();
  }

  return highlighterPromise;
}

function useShikiHighlighter() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    createSingletonHighlighter().then(() => {
      setIsReady(true);
    });
  }, []);

  const loadLanguage = useCallback(async (language: SupportedLanguage) => {
    const config = LANGUAGES[language];

    if (
      !config.shikiId ||
      !config.shikiLoader ||
      loadedLanguages.has(config.shikiId)
    ) {
      return;
    }

    const highlighter = await createSingletonHighlighter();
    const grammar = await config.shikiLoader();

    await highlighter.loadLanguage(grammar.default as never);
    loadedLanguages.add(config.shikiId);
  }, []);

  const highlight = useCallback(
    async (code: string, language: string) => {
      const normalizedLanguage = normalizeLanguage(language) ?? "plaintext";

      if (normalizedLanguage === "plaintext") {
        return `<pre class="shiki vesper" style="background-color:#101010;color:#ffffff"><code>${escapeHtml(code)}</code></pre>`;
      }

      const config = LANGUAGES[normalizedLanguage];

      if (!config.shikiId) {
        return `<pre class="shiki vesper" style="background-color:#101010;color:#ffffff"><code>${escapeHtml(code)}</code></pre>`;
      }

      await loadLanguage(normalizedLanguage);

      const highlighter = await createSingletonHighlighter();

      return highlighter.codeToHtml(code, {
        lang: config.shikiId,
        theme: THEME_NAME,
      });
    },
    [loadLanguage],
  );

  return {
    highlight,
    isReady,
    loadLanguage,
  };
}

export { useShikiHighlighter };
