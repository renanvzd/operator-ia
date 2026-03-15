import type { LanguageFn } from "highlight.js";

type ShikiLoader = () => Promise<{ default: unknown }>;
type HighlightLoader = () => Promise<{ default: LanguageFn }>;

type SupportedLanguage =
  | "plaintext"
  | "javascript"
  | "typescript"
  | "python"
  | "go"
  | "rust"
  | "java"
  | "ruby"
  | "php"
  | "sql"
  | "bash"
  | "html"
  | "css"
  | "json"
  | "yaml"
  | "markdown"
  | "c"
  | "cpp"
  | "csharp"
  | "swift"
  | "kotlin"
  | "dart";

type LanguageConfig = {
  label: string;
  shikiId?: string;
  shikiLoader?: ShikiLoader;
  highlightId?: string;
  highlightLoader?: HighlightLoader;
  aliases: string[];
};

const LANGUAGES: Record<SupportedLanguage, LanguageConfig> = {
  plaintext: {
    label: "Plain Text",
    aliases: ["text", "plain", "plaintext", "txt"],
  },
  javascript: {
    label: "JavaScript",
    shikiId: "javascript",
    shikiLoader: () => import("shiki/langs/javascript.mjs"),
    highlightId: "javascript",
    highlightLoader: () => import("highlight.js/lib/languages/javascript"),
    aliases: ["javascript", "js", "jsx", "mjs", "cjs"],
  },
  typescript: {
    label: "TypeScript",
    shikiId: "typescript",
    shikiLoader: () => import("shiki/langs/typescript.mjs"),
    highlightId: "typescript",
    highlightLoader: () => import("highlight.js/lib/languages/typescript"),
    aliases: ["typescript", "ts", "tsx", "cts", "mts"],
  },
  python: {
    label: "Python",
    shikiId: "python",
    shikiLoader: () => import("shiki/langs/python.mjs"),
    highlightId: "python",
    highlightLoader: () => import("highlight.js/lib/languages/python"),
    aliases: ["python", "py"],
  },
  go: {
    label: "Go",
    shikiId: "go",
    shikiLoader: () => import("shiki/langs/go.mjs"),
    highlightId: "go",
    highlightLoader: () => import("highlight.js/lib/languages/go"),
    aliases: ["go", "golang"],
  },
  rust: {
    label: "Rust",
    shikiId: "rust",
    shikiLoader: () => import("shiki/langs/rust.mjs"),
    highlightId: "rust",
    highlightLoader: () => import("highlight.js/lib/languages/rust"),
    aliases: ["rust", "rs"],
  },
  java: {
    label: "Java",
    shikiId: "java",
    shikiLoader: () => import("shiki/langs/java.mjs"),
    highlightId: "java",
    highlightLoader: () => import("highlight.js/lib/languages/java"),
    aliases: ["java"],
  },
  ruby: {
    label: "Ruby",
    shikiId: "ruby",
    shikiLoader: () => import("shiki/langs/ruby.mjs"),
    highlightId: "ruby",
    highlightLoader: () => import("highlight.js/lib/languages/ruby"),
    aliases: ["ruby", "rb"],
  },
  php: {
    label: "PHP",
    shikiId: "php",
    shikiLoader: () => import("shiki/langs/php.mjs"),
    highlightId: "php",
    highlightLoader: () => import("highlight.js/lib/languages/php"),
    aliases: ["php"],
  },
  sql: {
    label: "SQL",
    shikiId: "sql",
    shikiLoader: () => import("shiki/langs/sql.mjs"),
    highlightId: "sql",
    highlightLoader: () => import("highlight.js/lib/languages/sql"),
    aliases: ["sql"],
  },
  bash: {
    label: "Bash",
    shikiId: "bash",
    shikiLoader: () => import("shiki/langs/bash.mjs"),
    highlightId: "bash",
    highlightLoader: () => import("highlight.js/lib/languages/bash"),
    aliases: ["bash", "sh", "shell", "shellscript", "zsh"],
  },
  html: {
    label: "HTML",
    shikiId: "html",
    shikiLoader: () => import("shiki/langs/html.mjs"),
    highlightId: "xml",
    highlightLoader: () => import("highlight.js/lib/languages/xml"),
    aliases: ["html", "xml"],
  },
  css: {
    label: "CSS",
    shikiId: "css",
    shikiLoader: () => import("shiki/langs/css.mjs"),
    highlightId: "css",
    highlightLoader: () => import("highlight.js/lib/languages/css"),
    aliases: ["css", "scss", "sass", "less", "postcss"],
  },
  json: {
    label: "JSON",
    shikiId: "json",
    shikiLoader: () => import("shiki/langs/json.mjs"),
    highlightId: "json",
    highlightLoader: () => import("highlight.js/lib/languages/json"),
    aliases: ["json", "jsonc", "json5"],
  },
  yaml: {
    label: "YAML",
    shikiId: "yaml",
    shikiLoader: () => import("shiki/langs/yaml.mjs"),
    highlightId: "yaml",
    highlightLoader: () => import("highlight.js/lib/languages/yaml"),
    aliases: ["yaml", "yml"],
  },
  markdown: {
    label: "Markdown",
    shikiId: "markdown",
    shikiLoader: () => import("shiki/langs/markdown.mjs"),
    highlightId: "markdown",
    highlightLoader: () => import("highlight.js/lib/languages/markdown"),
    aliases: ["markdown", "md", "mdx"],
  },
  c: {
    label: "C",
    shikiId: "c",
    shikiLoader: () => import("shiki/langs/c.mjs"),
    highlightId: "c",
    highlightLoader: () => import("highlight.js/lib/languages/c"),
    aliases: ["c"],
  },
  cpp: {
    label: "C++",
    shikiId: "cpp",
    shikiLoader: () => import("shiki/langs/cpp.mjs"),
    highlightId: "cpp",
    highlightLoader: () => import("highlight.js/lib/languages/cpp"),
    aliases: ["cpp", "c++"],
  },
  csharp: {
    label: "C#",
    shikiId: "c",
    shikiLoader: () => import("shiki/langs/c.mjs"),
    highlightId: "csharp",
    highlightLoader: () => import("highlight.js/lib/languages/csharp"),
    aliases: ["csharp", "cs", "c#"],
  },
  swift: {
    label: "Swift",
    shikiId: "swift",
    shikiLoader: () => import("shiki/langs/swift.mjs"),
    highlightId: "swift",
    highlightLoader: () => import("highlight.js/lib/languages/swift"),
    aliases: ["swift"],
  },
  kotlin: {
    label: "Kotlin",
    shikiId: "kotlin",
    shikiLoader: () => import("shiki/langs/kotlin.mjs"),
    highlightId: "kotlin",
    highlightLoader: () => import("highlight.js/lib/languages/kotlin"),
    aliases: ["kotlin", "kt"],
  },
  dart: {
    label: "Dart",
    shikiId: "dart",
    shikiLoader: () => import("shiki/langs/dart.mjs"),
    highlightId: "dart",
    highlightLoader: () => import("highlight.js/lib/languages/dart"),
    aliases: ["dart"],
  },
};

const LANGUAGE_KEYS = Object.keys(LANGUAGES) as SupportedLanguage[];

const DETECTION_LANGUAGE_KEYS = LANGUAGE_KEYS.filter(
  (key) => key !== "plaintext" && LANGUAGES[key].highlightId,
);

function normalizeLanguage(input?: string | null): SupportedLanguage | null {
  if (!input) {
    return null;
  }

  const value = input.trim().toLowerCase();

  for (const key of LANGUAGE_KEYS) {
    if (key === value || LANGUAGES[key].aliases.includes(value)) {
      return key;
    }
  }

  return null;
}

const LANGUAGE_OPTIONS = LANGUAGE_KEYS.map((key) => ({
  value: key,
  label: LANGUAGES[key].label,
}));

export {
  DETECTION_LANGUAGE_KEYS,
  LANGUAGE_KEYS,
  LANGUAGE_OPTIONS,
  LANGUAGES,
  normalizeLanguage,
  type SupportedLanguage,
};
