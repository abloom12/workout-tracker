import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { workout, workout_exercise } from '@acme/db';

import { protectedProcedure, router } from '../trpc.js';

export const workoutRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, 'Workout name is required'),
        exerciseSetupIds: z
          .array(z.number().int().positive())
          .min(1, 'Add at least one exercise setup'),
      }),
    )
    .mutation(({ ctx, input }) =>
      ctx.db.transaction(async (tx) => {
        const uniqueIds = [...new Set(input.exerciseSetupIds)];
        const existing = await tx.query.exercise_setup.findMany({
          columns: { id: true },
          where: (setup, { inArray }) => inArray(setup.id, uniqueIds),
        });

        if (existing.length !== uniqueIds.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'One or more exercise setups do not exist',
          });
        }

        const saved = (
          await tx
            .insert(workout)
            .values({ ownerId: ctx.user.id, name: input.name })
            .returning({ id: workout.id })
        )[0];

        if (!saved) throw new Error('Workout insert returned no row');

        await tx.insert(workout_exercise).values(
          input.exerciseSetupIds.map((exerciseSetupId, position) => ({
            workout_id: saved.id,
            exercise_setup_id: exerciseSetupId,
            position,
          })),
        );

        return {
          id: saved.id,
          name: input.name,
          exerciseSetupIds: input.exerciseSetupIds,
        };
      }),
    ),
  list: protectedProcedure.query(async ({ ctx }) => {
    const workouts = await ctx.db.query.workout.findMany({
      columns: { id: true, name: true },
      where: (row, { eq }) => eq(row.ownerId, ctx.user.id),
      orderBy: (row, { asc }) => [asc(row.name), asc(row.id)],
      with: {
        exercises: {
          columns: { exercise_setup_id: true },
          orderBy: (row, { asc }) => [asc(row.position)],
        },
      },
    });

    return workouts.map(({ id, name, exercises }) => ({
      id,
      name,
      exerciseSetupIds: exercises.map(
        ({ exercise_setup_id }) => exercise_setup_id,
      ),
    }));
  }),
});
