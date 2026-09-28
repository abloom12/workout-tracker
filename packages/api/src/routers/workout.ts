import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { workout, workoutExercise } from '@acme/db';

import { protectedProcedure, router } from '../trpc.js';

export const workoutRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, 'Workout name is required'),
        exerciseIds: z
          .array(z.number().int().positive())
          .min(1, 'Add at least one Exercise'),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const uniqueIds = [...new Set(input.exerciseIds)];
        const existing = await tx.query.exercise.findMany({
          columns: { id: true },
          where: (exercise, { inArray }) => inArray(exercise.id, uniqueIds),
        });

        if (existing.length !== uniqueIds.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'One or more Exercises do not exist',
          });
        }

        const saved = (
          await tx
            .insert(workout)
            .values({ ownerId: ctx.user.id, name: input.name })
            .returning({ id: workout.id })
        )[0];

        if (!saved) throw new Error('Workout insert returned no row');

        await tx
          .insert(workoutExercise)
          .values(
            input.exerciseIds.map((exerciseId, position) => ({
              workoutId: saved.id,
              exerciseId,
              position,
            })),
          );

        return {
          id: saved.id,
          name: input.name,
          exerciseIds: input.exerciseIds,
        };
      }),
    ),
  list: protectedProcedure.query(async ({ ctx }) => {
    const workouts = await ctx.db.query.workout.findMany({
      columns: { id: true, name: true },
      where: (row, { eq }) => eq(row.ownerId, ctx.user.id),
      orderBy: (row, { desc }) => [desc(row.id)],
      with: {
        exercises: {
          columns: { exerciseId: true },
          orderBy: (row, { asc }) => [asc(row.position)],
        },
      },
    });

    return workouts.map(({ id, name, exercises }) => ({
      id,
      name,
      exerciseIds: exercises.map(({ exerciseId }) => exerciseId),
    }));
  }),
});
