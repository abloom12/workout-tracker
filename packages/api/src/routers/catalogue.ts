import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  createExercise,
  exerciseMuscleRole,
  ExerciseWriteError,
  getUserAccess,
  listAttachments,
  listEquipment,
  listExercises,
  listModifiers,
  listMuscles,
  saveExercises,
  updateExercise,
} from '@acme/db';

import { protectedProcedure, router } from '../trpc.js';

const catalogueId = z.int().positive();
const exerciseInput = z.strictObject({
  name: z.string().trim().min(1, 'Name is required').max(200),
  equipmentId: catalogueId,
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

function generateExerciseCode(name: string) {
  return name
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

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
      code_conflict:
        'That name generates a code already in use. Choose a different exercise name.',
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
    })),
    list: protectedProcedure.query(({ ctx }) => listExercises(ctx.db)),
    create: exerciseWriteProcedure
      .input(
        exerciseInput.refine(
          ({ name }) => generateExerciseCode(name).length > 0,
          {
            message: 'Name must contain a letter or number to generate a code',
            path: ['name'],
          },
        ),
      )
      .mutation(async ({ ctx, input }) => {
        try {
          return await createExercise(ctx.db, {
            ...input,
            code: generateExerciseCode(input.name),
          });
        } catch (error) {
          throwExerciseWriteError(error);
        }
      }),
    save: exerciseWriteProcedure
      .input(
        z.strictObject({
          changes: z
            .array(
              exerciseInput
                .safeExtend({ id: catalogueId.optional() })
                .refine(
                  ({ id, name }) =>
                    id !== undefined || generateExerciseCode(name).length > 0,
                  {
                    message:
                      'Name must contain a letter or number to generate a code',
                    path: ['name'],
                  },
                ),
            )
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
          return await saveExercises(
            ctx.db,
            input.changes.map(({ id, ...change }) =>
              id === undefined ?
                { ...change, code: generateExerciseCode(change.name) }
              : { ...change, id },
            ),
          );
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
      .input(exerciseInput.safeExtend({ id: catalogueId }))
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
  muscles: router({
    list: protectedProcedure.query(({ ctx }) => listMuscles(ctx.db)),
  }),
});
