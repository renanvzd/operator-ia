import { avg, count } from "drizzle-orm";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";

const roastRouter = createTRPCRouter({
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
