import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  createExercise,
  exerciseMechanics,
  exerciseMuscleRole,
  ExerciseWriteError,
  getUserAccess,
  gripOrientation,
  gripWidth,
  listAttachments,
  listEquipment,
  listExercises,
  listModifiers,
  listMovementPatterns,
  listMuscles,
  saveExercises,
  updateExercise,
} from '@acme/db';

import { protectedProcedure, router } from '../trpc.js';

const catalogueId = z.int().positive();
const exerciseInput = z.strictObject({
  name: z.string().trim().min(1, 'Name is required').max(200),
  equipmentId: z.uuid(),
  gripOrientation: z.enum(gripOrientation.enumValues).nullable().optional(),
  gripWidth: z.enum(gripWidth.enumValues).nullable().optional(),
  isUnilateral: z.boolean().optional(),
  mechanics: z.enum(exerciseMechanics.enumValues).nullable().optional(),
  movementPatternIds: z
    .array(catalogueId)
    .max(100)
    .refine((ids) => new Set(ids).size === ids.length, {
      message: 'Movement patterns must not be repeated',
    })
    .optional(),
  muscles: z
    .array(
      z.strictObject({
        muscleId: catalogueId,
        role: z.enum(exerciseMuscleRole.enumValues),
      }),
    )
    .max(100)
    .refine(
      (muscles) =>
        new Set(muscles.map(({ muscleId }) => muscleId)).size ===
        muscles.length,
      { message: 'Muscles must not be repeated' },
    ),
});

const exerciseWriteProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Check the current database role rather than trusting the cookie cache.
  const actor = await getUserAccess(ctx.db, ctx.session.user.id);

  if (actor?.banned || !actor?.role?.split(',').includes('admin')) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only admins can create or edit exercises.',
    });
  }

  return next();
});

function throwExerciseWriteError(error: unknown, exerciseName?: string): never {
  if (error instanceof TRPCError) throw error;

  if (error instanceof ExerciseWriteError) {
    const messages = {
      name_conflict: 'An exercise with that name already exists.',
      conflict: 'An exercise with those values already exists.',
      invalid_reference:
        'A selected catalogue value no longer exists. Refresh and try again.',
      not_found: 'This exercise no longer exists. Refresh and try again.',
    };

    throw new TRPCError({
      code:
        error.kind === 'invalid_reference' ? 'BAD_REQUEST'
        : error.kind === 'not_found' ? 'NOT_FOUND'
        : 'CONFLICT',
      message:
        exerciseName ?
          `${exerciseName}: ${messages[error.kind]}`
        : messages[error.kind],
      cause: error,
    });
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Unable to save the exercise. Please try again.',
    cause: error,
  });
}

export const catalogueRouter = router({
  exercises: router({
    options: protectedProcedure.query(() => ({
      muscleRoles: exerciseMuscleRole.enumValues,
      gripOrientations: gripOrientation.enumValues,
      gripWidths: gripWidth.enumValues,
      mechanics: exerciseMechanics.enumValues,
    })),
    list: protectedProcedure.query(({ ctx }) => listExercises(ctx.db)),
    create: exerciseWriteProcedure
      .input(exerciseInput)
      .mutation(async ({ ctx, input }) => {
        try {
          return await createExercise(ctx.db, input);
        } catch (error) {
          throwExerciseWriteError(error);
        }
      }),
    save: exerciseWriteProcedure
      .input(
        z.strictObject({
          changes: z
            .array(exerciseInput.safeExtend({ id: z.uuid().optional() }))
            .min(1)
            .refine(
              (changes) => {
                const ids = changes.flatMap(({ id }) =>
                  id === undefined ? [] : [id],
                );
                return new Set(ids).size === ids.length;
              },
              { message: 'An exercise must not be updated more than once' },
            ),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        try {
          return await saveExercises(ctx.db, input.changes);
        } catch (error) {
          const exerciseName =
            (
              error instanceof ExerciseWriteError &&
              error.changeIndex !== undefined
            ) ?
              input.changes[error.changeIndex]?.name
            : undefined;
          throwExerciseWriteError(error, exerciseName);
        }
      }),
    update: exerciseWriteProcedure
      .input(exerciseInput.safeExtend({ id: z.uuid() }))
      .mutation(async ({ ctx, input }) => {
        try {
          const exercise = await updateExercise(ctx.db, input.id, input);

          if (!exercise) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'This exercise no longer exists. Refresh and try again.',
            });
          }

          return exercise;
        } catch (error) {
          throwExerciseWriteError(error);
        }
      }),
  }),
  equipment: router({
    list: protectedProcedure.query(({ ctx }) => listEquipment(ctx.db)),
  }),
  attachments: router({
    list: protectedProcedure.query(({ ctx }) => listAttachments(ctx.db)),
  }),
  modifiers: router({
    list: protectedProcedure.query(({ ctx }) => listModifiers(ctx.db)),
  }),
  movementPatterns: router({
    list: protectedProcedure.query(({ ctx }) => listMovementPatterns(ctx.db)),
  }),
  muscles: router({
    list: protectedProcedure.query(({ ctx }) => listMuscles(ctx.db)),
  }),
});
