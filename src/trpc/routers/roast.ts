import { asc, avg, count, eq } from "drizzle-orm";
import { z } from "zod";
import { analysisItems, roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const roastRouter = createTRPCRouter({
  getById: baseProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const [roast, items] = await Promise.all([
        ctx.db
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
          .where(eq(roasts.id, input.id))
          .then((rows) => rows[0] ?? null),
        ctx.db
          .select({
            id: analysisItems.id,
            severity: analysisItems.severity,
            title: analysisItems.title,
            description: analysisItems.description,
            order: analysisItems.order,
          })
          .from(analysisItems)
          .where(eq(analysisItems.roastId, input.id))
          .orderBy(asc(analysisItems.order)),
      ]);

      if (!roast) {
        return null;
      }

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
