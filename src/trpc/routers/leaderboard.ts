import { asc, sql } from "drizzle-orm";
import { z } from "zod";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const leaderboardRouter = createTRPCRouter({
  getLeaderboard: baseProcedure
    .input(
      z
        .object({
          limit: z.number().int().min(1).optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = Math.min(input?.limit ?? 3, 20);

      const rows = await ctx.db
        .select({
          id: roasts.id,
          code: roasts.code,
          language: roasts.language,
          lineCount: roasts.lineCount,
          score: roasts.score,
          rank: sql<number>`row_number() over (order by ${roasts.score} asc)`.mapWith(
            Number,
          ),
          totalRoasts: sql<number>`count(*) over ()`.mapWith(Number),
          avgScore: sql<number>`avg(${roasts.score}) over ()`.mapWith(Number),
        })
        .from(roasts)
        .orderBy(asc(roasts.score))
        .limit(limit);

      return {
        entries: rows.map((row) => ({
          id: row.id,
          rank: row.rank,
          score: row.score,
          language: row.language,
          code: row.code,
          lineCount: row.lineCount,
        })),
        totalRoasts: rows[0]?.totalRoasts ?? 0,
        avgScore: Number((rows[0]?.avgScore ?? 0).toFixed(1)),
      };
    }),
});

export { leaderboardRouter };
