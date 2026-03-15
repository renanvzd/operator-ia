import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const model = openai("gpt-4o-mini");

const roastOutputSchema = z.object({
  score: z.number().min(0).max(10),
  verdict: z.enum([
    "needs_serious_help",
    "rough_around_edges",
    "decent_code",
    "solid_work",
    "exceptional",
  ]),
  roastQuote: z.string().min(1),
  analysisItems: z
    .array(
      z.object({
        severity: z.enum(["critical", "warning", "good"]),
        title: z.string().min(1),
        description: z.string().min(1),
      }),
    )
    .min(3)
    .max(6),
  suggestedFix: z.string().min(1),
});

type RoastOutput = z.infer<typeof roastOutputSchema>;

function getSystemPrompt(roastMode: boolean) {
  const basePrompt = `You are an expert senior code reviewer.

Analyze the submitted code and return a structured review.

Rules:
- Score from 0.0 to 10.0 using one decimal place.
- Pick the verdict that matches the score exactly:
  - 0.0 to 2.0 => needs_serious_help
  - 2.1 to 4.0 => rough_around_edges
  - 4.1 to 6.0 => decent_code
  - 6.1 to 8.0 => solid_work
  - 8.1 to 10.0 => exceptional
- Generate 3 to 6 analysis items.
- Order analysis items by severity: critical first, then warning, then good.
- Each analysis item needs a short title and a concise, technically accurate description.
- Generate suggestedFix as the complete improved version of the code, preserving the language and original intent.
- Never omit suggestedFix, even if the code is already good.
- Keep output grounded in the submitted code. Do not invent frameworks or files that are not present.
- roastQuote must be a single sentence.`;

  if (roastMode) {
    return `${basePrompt}

Roast mode is enabled.
- Keep the technical analysis accurate.
- Make roastQuote sharply sarcastic, memorable, and funny.
- Make analysis descriptions witty and cutting, but still useful.
- Sound like a battle-tested senior engineer who has seen too much bad code.`;
  }

  return `${basePrompt}

Roast mode is disabled.
- Be direct, professional, and constructive.
- Make roastQuote honest and concise.
- Make analysis descriptions actionable and clear.`;
}

export { getSystemPrompt, model, type RoastOutput, roastOutputSchema };
