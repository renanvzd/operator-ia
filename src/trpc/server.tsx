import "server-only";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { cache } from "react";
import { createCallerFactory, createTRPCContext } from "@/trpc/init";
import { makeQueryClient } from "@/trpc/query-client";
import { appRouter } from "@/trpc/routers/_app";

const getQueryClient = cache(makeQueryClient);

const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

const createCaller = createCallerFactory(appRouter);
const caller = createCaller(createTRPCContext);

function HydrateClient({ children }: { children: React.ReactNode }) {
  return (
    <HydrationBoundary state={dehydrate(getQueryClient())}>
      {children}
    </HydrationBoundary>
  );
}

function prefetch(
  queryOptions: ReturnType<typeof trpc.roast.getStats.queryOptions>,
) {
  void getQueryClient().prefetchQuery(queryOptions);
}

export { caller, getQueryClient, HydrateClient, prefetch, trpc };
