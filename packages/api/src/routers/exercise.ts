import { listExercises } from '@acme/db';

import { protectedProcedure, router } from '../trpc.js';

export const exerciseRouter = router({
  list: protectedProcedure.query(({ ctx }) => listExercises(ctx.db)),
});
