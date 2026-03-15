import { initTRPC } from "@trpc/server";
import { cache } from "react";
import { db } from "@/db";

const createTRPCContext = cache(async () => {
  return { db };
});

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create();

const createTRPCRouter = t.router;
const createCallerFactory = t.createCallerFactory;
const baseProcedure = t.procedure;

export type { TRPCContext };
export {
  baseProcedure,
  createCallerFactory,
  createTRPCContext,
  createTRPCRouter,
};
