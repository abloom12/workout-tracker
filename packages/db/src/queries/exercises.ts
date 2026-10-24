import { eq } from 'drizzle-orm';

import type { Database } from '../index.js';
import { exercise_setup, exercise_setup_attachment } from '../schema.js';

export type ExerciseSetupInput = {
  name: string;
  exerciseId: number;
  equipmentId: number;
  gripId: number;
  allowedAttachmentIds: number[];
  attachmentRequired: boolean;
  loadConvention: (typeof exercise_setup.$inferInsert)['load_convention'];
  isUnilateral: boolean;
};

function setupValues(input: ExerciseSetupInput) {
  return {
    name: input.name,
    exercise_id: input.exerciseId,
    equipment_id: input.equipmentId,
    grip_id: input.gripId,
    attachment_required: input.attachmentRequired,
    load_convention: input.loadConvention,
    is_unilateral: input.isUnilateral,
  };
}

export async function createExerciseSetup(
  db: Database,
  input: ExerciseSetupInput & { code: string },
) {
  return db.transaction(async (tx) => {
    const [setup] = await tx
      .insert(exercise_setup)
      .values({ ...setupValues(input), code: input.code })
      .returning({ id: exercise_setup.id, code: exercise_setup.code });

    if (!setup) {
      throw new Error('Setup creation did not return a record');
    }

    if (input.allowedAttachmentIds.length > 0) {
      await tx
        .insert(exercise_setup_attachment)
        .values(
          input.allowedAttachmentIds.map((attachmentId) => ({
            exercise_setup_id: setup.id,
            attachment_id: attachmentId,
          })),
        );
    }

    return setup;
  });
}

export async function updateExerciseSetup(
  db: Database,
  id: number,
  input: ExerciseSetupInput,
) {
  return db.transaction(async (tx) => {
    const [setup] = await tx
      .update(exercise_setup)
      .set(setupValues(input))
      .where(eq(exercise_setup.id, id))
      .returning({ id: exercise_setup.id, code: exercise_setup.code });

    if (!setup) return null;

    await tx
      .delete(exercise_setup_attachment)
      .where(eq(exercise_setup_attachment.exercise_setup_id, id));

    if (input.allowedAttachmentIds.length > 0) {
      await tx
        .insert(exercise_setup_attachment)
        .values(
          input.allowedAttachmentIds.map((attachmentId) => ({
            exercise_setup_id: id,
            attachment_id: attachmentId,
          })),
        );
    }

    return setup;
  });
}

export async function listExercises(db: Database) {
  return db.query.exercise.findMany({
    columns: { id: true, code: true, name: true },
    orderBy: (exercise, { asc }) => [asc(exercise.name), asc(exercise.id)],
  });
}

export async function listExerciseSetups(db: Database) {
  const setups = await db.query.exercise_setup.findMany({
    columns: {
      id: true,
      code: true,
      name: true,
      load_convention: true,
      is_unilateral: true,
      attachment_required: true,
    },
    with: {
      exercise: { columns: { id: true, code: true, name: true } },
      equipment: { columns: { id: true, code: true, name: true } },
      grip: { columns: { id: true, code: true, name: true } },
      allowedAttachments: {
        with: { attachment: { columns: { id: true, code: true, name: true } } },
      },
    },
    orderBy: (setup, { asc }) => [asc(setup.name), asc(setup.id)],
  });

  return setups.map((setup) => ({
    id: setup.id,
    code: setup.code,
    name: setup.name,
    exercise: setup.exercise,
    equipment: setup.equipment,
    grip: setup.grip,
    allowedAttachments: setup.allowedAttachments
      .map(({ attachment }) => attachment)
      .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id),
    attachmentRequired: setup.attachment_required,
    loadConvention: setup.load_convention,
    isUnilateral: setup.is_unilateral,
  }));
}
