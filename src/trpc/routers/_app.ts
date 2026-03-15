import { createTRPCRouter } from "@/trpc/init";
import { roastRouter } from "@/trpc/routers/roast";

const appRouter = createTRPCRouter({
  roast: roastRouter,
});

type AppRouter = typeof appRouter;

export type { AppRouter };
export { appRouter };
