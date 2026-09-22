import { protectedProcedure, publicProcedure, router } from '../trpc.js';

export const healthRouter = router({
  ping: publicProcedure.query(() => ({ ok: true, message: 'pong' })),

  me: protectedProcedure.query(({ ctx }) => ({ user: ctx.user })),
});
