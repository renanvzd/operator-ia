import { TRPCError } from "@trpc/server";
import { generateText, Output } from "ai";
import { asc, avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { analysisItems, roasts } from "@/db/schema";
import { getSystemPrompt, model, roastOutputSchema } from "@/lib/ai";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const roastRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        code: z.string().trim().min(1).max(2000),
        language: z.string().min(1),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!process.env.OPENAI_API_KEY) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "OPENAI_API_KEY is not configured",
        });
      }

      const { output } = await generateText({
        model,
        output: Output.object({ schema: roastOutputSchema }),
        system: getSystemPrompt(input.roastMode),
        prompt: `Language: ${input.language}\n\nCode:\n${input.code}`,
      });

      if (!output) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "AI failed to generate a valid roast",
        });
      }

      const lineCount = input.code.split("\n").length;
      const score = Number(output.score.toFixed(1));

      const roastId = await ctx.db.transaction(async (tx) => {
        const [roast] = await tx
          .insert(roasts)
          .values({
            code: input.code,
            language: input.language,
            lineCount,
            roastMode: input.roastMode,
            score,
            verdict: output.verdict,
            roastQuote: output.roastQuote,
            suggestedFix: output.suggestedFix,
          })
          .returning({ id: roasts.id });

        if (output.analysisItems.length > 0) {
          await tx.insert(analysisItems).values(
            output.analysisItems.map((item, index) => ({
              roastId: roast.id,
              severity: item.severity,
              title: item.title,
              description: item.description,
              order: index,
            })),
          );
        }

        return roast.id;
      });

      return { id: roastId };
    }),
  getById: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [roast] = await ctx.db
        .select({
          id: roasts.id,
          code: roasts.code,
          language: roasts.language,
          lineCount: roasts.lineCount,
          score: roasts.score,
          verdict: roasts.verdict,
          roastQuote: roasts.roastQuote,
          suggestedFix: roasts.suggestedFix,
        })
        .from(roasts)
        .where(eq(roasts.id, input.id));

      if (!roast) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Roast not found",
        });
      }

      const items = await ctx.db
        .select({
          id: analysisItems.id,
          severity: analysisItems.severity,
          title: analysisItems.title,
          description: analysisItems.description,
          order: analysisItems.order,
        })
        .from(analysisItems)
        .where(eq(analysisItems.roastId, roast.id))
        .orderBy(asc(analysisItems.order));

      return {
        ...roast,
        analysisItems: items,
      };
    }),
  getStats: baseProcedure.query(async ({ ctx }) => {
    const [stats] = await ctx.db
      .select({
        totalRoasts: count(roasts.id),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: Number(stats?.totalRoasts ?? 0),
      avgScore: Number(Number(stats?.avgScore ?? 0).toFixed(1)),
    };
  }),
});

export { roastRouter };
