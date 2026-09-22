import { protectedProcedure, router } from '../trpc.js';

export const exerciseRouter = router({
  list: protectedProcedure.query(({ ctx }) =>
    ctx.db.query.exercise.findMany({
      columns: { id: true, name: true },
      orderBy: (exercise, { asc }) => [asc(exercise.name)],
    }),
  ),
});
