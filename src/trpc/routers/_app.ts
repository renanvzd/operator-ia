import { createTRPCRouter } from "@/trpc/init";
import { leaderboardRouter } from "@/trpc/routers/leaderboard";
import { roastRouter } from "@/trpc/routers/roast";

const appRouter = createTRPCRouter({
  leaderboard: leaderboardRouter,
  roast: roastRouter,
});

type AppRouter = typeof appRouter;

export type { AppRouter };
export { appRouter };
