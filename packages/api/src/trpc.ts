import type { Auth } from 'better-auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

import type { Database } from '@acme/db';

export type ApiSession = Auth['$Infer']['Session'] | null;

export type ApiContext = {
  db: Database;
  req: CreateFastifyContextOptions['req'];
  res: CreateFastifyContextOptions['res'];
  session: ApiSession;
};

const t = initTRPC.context<ApiContext>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({ ctx: { session: ctx.session, user: ctx.session.user } });
});
