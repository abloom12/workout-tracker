import type { Auth } from 'better-auth';
import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { fromNodeHeaders } from 'better-auth/node';

import type { Database } from '@acme/db';

import type { ApiContext } from './trpc.js';
import { exerciseRouter } from './routers/exercise.js';
import { healthRouter } from './routers/health.js';
import { router } from './trpc.js';

export type { ApiContext, ApiSession } from './trpc.js';

export type AppRouter = ReturnType<typeof createAppRouter>;

export type Api = {
  appRouter: AppRouter;
  createContext: (options: CreateFastifyContextOptions) => Promise<ApiContext>;
};

function createAppRouter() {
  return router({ exercise: exerciseRouter, health: healthRouter });
}

export function createApi(auth: Auth, db: Database): Api {
  async function createContext({
    req,
    res,
  }: CreateFastifyContextOptions): Promise<ApiContext> {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    return { db, req, res, session };
  }

  const appRouter = createAppRouter();

  return { appRouter, createContext };
}
