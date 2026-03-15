import "dotenv/config";

import { faker } from "@faker-js/faker";
import { db, pool } from "@/db";
import { analysisItems, roasts } from "@/db/schema";

type SupportedLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "go"
  | "rust"
  | "sql"
  | "html"
  | "css";

type Verdict =
  | "needs_serious_help"
  | "rough_around_edges"
  | "decent_code"
  | "solid_work"
  | "exceptional";

type Severity = "critical" | "warning" | "good";

const ROAST_COUNT = 100;

const languageTemplates: Record<SupportedLanguage, string[]> = {
  javascript: [
    "function calculateTotal(items) {\n  var total = 0;\n  for (var i = 0; i < items.length; i++) {\n    total = total + items[i].price;\n  }\n  return total;\n}",
    "const users = data.map((item) => {\n  return { id: item.id, name: item.name };\n});\nconsole.log(users);",
  ],
  typescript: [
    "type User = { id: string; score: number };\n\nfunction rank(users: User[]) {\n  return users.sort((a, b) => b.score - a.score);\n}",
    "interface Config {\n  apiUrl: string;\n  retries?: number;\n}\n\nexport function setup(config: Config) {\n  return config.apiUrl;\n}",
  ],
  python: [
    "def calculate_total(items):\n    total = 0\n    for item in items:\n        total += item['price']\n    return total",
    "class UserService:\n    def find_user(self, users, user_id):\n        for user in users:\n            if user['id'] == user_id:\n                return user\n        return None",
  ],
  go: [
    "func Sum(items []int) int {\n\ttotal := 0\n\tfor _, item := range items {\n\t\ttotal += item\n\t}\n\treturn total\n}",
    "type User struct {\n\tID string\n\tName string\n}\n\nfunc Find(users []User, id string) *User {\n\tfor _, user := range users {\n\t\tif user.ID == id {\n\t\t\treturn &user\n\t\t}\n\t}\n\treturn nil\n}",
  ],
  rust: [
    "fn sum(items: Vec<i32>) -> i32 {\n    let mut total = 0;\n    for item in items {\n        total += item;\n    }\n    total\n}",
    "struct User {\n    id: String,\n    score: i32,\n}\n\nfn top_score(users: Vec<User>) -> Option<User> {\n    users.into_iter().max_by_key(|user| user.score)\n}",
  ],
  sql: [
    "SELECT id, name, created_at\nFROM users\nWHERE deleted_at IS NULL\nORDER BY created_at DESC;",
    "UPDATE orders\nSET status = 'processed'\nWHERE paid = true\n  AND status = 'pending';",
  ],
  html: [
    '<section class="hero">\n  <h1>DevRoast</h1>\n  <p>Paste your code. Get roasted.</p>\n</section>',
    "<ul>\n  <li>fast feedback</li>\n  <li>leaderboard</li>\n  <li>roast mode</li>\n</ul>",
  ],
  css: [
    ".card {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  border: 1px solid #2a2a2a;\n}",
    ".button:hover {\n  transform: translateY(-1px);\n  transition: transform 120ms ease;\n}",
  ],
};

const roastQuotes = [
  "this code has the confidence of senior code and the judgment of a toaster",
  "i have seen worse, but only in cautionary tales",
  "this almost works, which somehow makes it more upsetting",
  "clean enough to ship, messy enough to haunt future you",
  "surprisingly solid. suspicious, honestly",
];

const findingPools: Record<
  Severity,
  Array<{ title: string; description: string }>
> = {
  critical: [
    {
      title: "unsafe control flow",
      description:
        "the current implementation mixes state changes and branching in a way that makes failures difficult to reason about.",
    },
    {
      title: "mutation overload",
      description:
        "shared mutable state makes the function harder to test and increases the odds of subtle regressions.",
    },
    {
      title: "missing error boundary",
      description:
        "there is no clear failure path, so runtime issues will leak into the user experience.",
    },
  ],
  warning: [
    {
      title: "naming could be clearer",
      description:
        "some variables communicate implementation details instead of intent, which slows down future maintenance.",
    },
    {
      title: "logic is harder than necessary",
      description:
        "the feature works, but it could be simplified to reduce branching and improve readability.",
    },
    {
      title: "missed extraction opportunity",
      description:
        "a repeated pattern could be isolated into a helper to make the code more reusable and easier to scan.",
    },
  ],
  good: [
    {
      title: "intent is mostly readable",
      description:
        "the overall direction is understandable, which makes future cleanup much easier.",
    },
    {
      title: "sensible structure",
      description:
        "the implementation follows a predictable flow and avoids unnecessary abstraction.",
    },
    {
      title: "reasonable separation",
      description:
        "responsibilities are grouped well enough that the next refactor has a good foundation.",
    },
  ],
};

function getVerdict(score: number): Verdict {
  if (score <= 2) return "needs_serious_help";
  if (score <= 4) return "rough_around_edges";
  if (score <= 6) return "decent_code";
  if (score <= 8) return "solid_work";
  return "exceptional";
}

function getLineCount(code: string) {
  return code.split("\n").length;
}

function getSuggestedFix(code: string, language: SupportedLanguage) {
  if (language === "javascript" || language === "typescript") {
    return code.replaceAll("var ", "const ");
  }

  if (language === "python") {
    return `${code}\n\n# improved: extract reusable helpers and add validation`;
  }

  return `${code}\n\n// improved: simplify control flow and improve naming`;
}

function getLanguage(): SupportedLanguage {
  return faker.helpers.arrayElement(
    Object.keys(languageTemplates) as SupportedLanguage[],
  );
}

function getCode(language: SupportedLanguage) {
  return faker.helpers.arrayElement(languageTemplates[language]);
}

function getSeverityMix(score: number): Severity[] {
  if (score <= 2) return ["critical", "critical", "warning"];
  if (score <= 4) return ["critical", "warning", "warning"];
  if (score <= 6) return ["warning", "warning", "good"];
  if (score <= 8) return ["warning", "good", "good"];
  return ["good", "good", "good"];
}

async function seed() {
  faker.seed(42);

  await db.delete(analysisItems);
  await db.delete(roasts);

  for (let index = 0; index < ROAST_COUNT; index += 1) {
    const language = getLanguage();
    const code = getCode(language);
    const score = Number(
      faker.number.float({ min: 0, max: 10, fractionDigits: 1 }).toFixed(1),
    );
    const verdict = getVerdict(score);
    const roastMode = faker.datatype.boolean();
    const createdAt = faker.date.recent({ days: 30 });

    const [roast] = await db
      .insert(roasts)
      .values({
        code,
        language,
        lineCount: getLineCount(code),
        roastMode,
        score,
        verdict,
        roastQuote: faker.helpers.arrayElement(roastQuotes),
        suggestedFix: getSuggestedFix(code, language),
        createdAt,
      })
      .returning({ id: roasts.id });

    const severities = getSeverityMix(score);
    const itemsToInsert = severities.map((severity, findingIndex) => {
      const finding = faker.helpers.arrayElement(findingPools[severity]);

      return {
        roastId: roast.id,
        severity,
        title: finding.title,
        description: finding.description,
        order: findingIndex,
      };
    });

    await db.insert(analysisItems).values(itemsToInsert);
  }

  console.log(`Seed completed with ${ROAST_COUNT} roasts.`);
}

seed()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
