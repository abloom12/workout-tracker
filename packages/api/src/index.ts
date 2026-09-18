import type { Auth } from 'better-auth';
import { initTRPC, TRPCError } from '@trpc/server';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { fromNodeHeaders } from 'better-auth/node';

export type ApiSession = Auth['$Infer']['Session'] | null;
export type ApiContext = {
  req: CreateFastifyContextOptions['req'];
  res: CreateFastifyContextOptions['res'];
  session: ApiSession;
};
export type AppRouter = ReturnType<typeof createAppRouter>;
export type Api = {
  appRouter: AppRouter;
  createContext: (options: CreateFastifyContextOptions) => Promise<ApiContext>;
};

function createAppRouter() {
  const t = initTRPC.context<ApiContext>().create();

  const router = t.router;
  const publicProcedure = t.procedure;

  const protectedProcedure = t.procedure.use(({ ctx, next }) => {
    if (!ctx.session?.user || !ctx.session?.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    return next({
      ctx: { ...ctx, session: ctx.session, user: ctx.session.user },
    });
  });

  const healthRouter = router({
    ping: publicProcedure.query(() => ({ ok: true, message: 'pong' })),
    me: protectedProcedure.query(({ ctx }) => ({ user: ctx.user })),
  });

  return router({ health: healthRouter });
}

export function createApi(auth: Auth): Api {
  async function createContext({
    req,
    res,
  }: CreateFastifyContextOptions): Promise<ApiContext> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    return { req, res, session };
  }

  const appRouter = createAppRouter();

  return { appRouter, createContext };
}
