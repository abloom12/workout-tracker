import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import {
  createExerciseSetup,
  listAttachments,
  listEquipment,
  listExercises,
  listExerciseSetups,
  listGrips,
  listModifiers,
  listMuscles,
  loadConvention,
  updateExerciseSetup,
} from '@acme/db';

import { protectedProcedure, router } from '../trpc.js';

const catalogueId = z.int().positive();
const setupInput = z
  .strictObject({
    name: z.string().trim().min(1, 'Name is required').max(200),
    exerciseId: catalogueId,
    equipmentId: catalogueId,
    gripId: catalogueId,
    allowedAttachmentIds: z
      .array(catalogueId)
      .max(100)
      .refine((ids) => new Set(ids).size === ids.length, {
        message: 'Attachments must not be repeated',
      }),
    attachmentRequired: z.boolean(),
    loadConvention: z.enum(loadConvention.enumValues),
    isUnilateral: z.boolean(),
  })
  .refine(
    (input) =>
      !input.attachmentRequired || input.allowedAttachmentIds.length > 0,
    {
      message: 'Select at least one allowed attachment when one is required',
      path: ['allowedAttachmentIds'],
    },
  );

function generateSetupCode(name: string) {
  return name
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

const setupWriteProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  // Check the current database role rather than trusting the cookie cache.
  const actor = await ctx.db.query.user.findFirst({
    columns: { role: true, banned: true },
    where: (user, { eq }) => eq(user.id, ctx.session.user.id),
  });

  if (actor?.banned || !actor?.role?.split(',').includes('admin')) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Only admins can create or edit setups.',
    });
  }

  return next();
});

function throwSetupWriteError(error: unknown): never {
  if (error instanceof TRPCError) throw error;

  let cause = error;

  while (cause instanceof Error) {
    if ('code' in cause && cause.code === '23505') {
      const isCodeConflict =
        'constraint' in cause &&
        cause.constraint === 'exercise_setup_code_unique';

      throw new TRPCError({
        code: 'CONFLICT',
        message:
          isCodeConflict ?
            'That name generates a code already in use. Choose a different setup name.'
          : 'A setup already exists for this exercise, equipment, grip, and unilateral setting.',
        cause: error,
      });
    }

    if ('code' in cause && cause.code === '23503') {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message:
          'A selected catalogue value no longer exists. Refresh and try again.',
        cause: error,
      });
    }

    cause = cause.cause;
  }

  throw new TRPCError({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'Unable to save the setup. Please try again.',
    cause: error,
  });
}

export const catalogueRouter = router({
  exercises: router({
    list: protectedProcedure.query(({ ctx }) => listExercises(ctx.db)),
  }),
  setups: router({
    list: protectedProcedure.query(({ ctx }) => listExerciseSetups(ctx.db)),
    create: setupWriteProcedure
      .input(
        setupInput.refine(({ name }) => generateSetupCode(name).length > 0, {
          message: 'Name must contain a letter or number to generate a code',
          path: ['name'],
        }),
      )
      .mutation(async ({ ctx, input }) => {
        try {
          return await createExerciseSetup(ctx.db, {
            ...input,
            code: generateSetupCode(input.name),
          });
        } catch (error) {
          throwSetupWriteError(error);
        }
      }),
    update: setupWriteProcedure
      .input(setupInput.safeExtend({ id: catalogueId }))
      .mutation(async ({ ctx, input }) => {
        try {
          const setup = await updateExerciseSetup(ctx.db, input.id, input);

          if (!setup) {
            throw new TRPCError({
              code: 'NOT_FOUND',
              message: 'This setup no longer exists. Refresh and try again.',
            });
          }

          return setup;
        } catch (error) {
          throwSetupWriteError(error);
        }
      }),
  }),
  equipment: router({
    list: protectedProcedure.query(({ ctx }) => listEquipment(ctx.db)),
  }),
  attachments: router({
    list: protectedProcedure.query(({ ctx }) => listAttachments(ctx.db)),
  }),
  grips: router({
    list: protectedProcedure.query(({ ctx }) => listGrips(ctx.db)),
  }),
  modifiers: router({
    list: protectedProcedure.query(({ ctx }) => listModifiers(ctx.db)),
  }),
  muscles: router({
    list: protectedProcedure.query(({ ctx }) => listMuscles(ctx.db)),
  }),
});
