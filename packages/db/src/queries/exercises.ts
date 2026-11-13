import { eq } from 'drizzle-orm';

import type { Database } from '../index.js';
import {
  exercise,
  exercise_movement_pattern,
  exercise_muscle,
} from '../schema.js';

export type ExerciseInput = {
  name: string;
  equipmentId: string;
  gripOrientation?: (typeof exercise.$inferSelect)['grip_orientation'];
  gripWidth?: (typeof exercise.$inferSelect)['grip_width'];
  isUnilateral?: (typeof exercise.$inferSelect)['is_unilateral'];
  mechanics?: (typeof exercise.$inferSelect)['mechanics'];
  movementPatternIds?: number[];
  muscles: {
    muscleId: number;
    role: (typeof exercise_muscle.$inferSelect)['role'];
  }[];
};

export type ExerciseChange = ExerciseInput & { id?: string };

type ExerciseWriter = Pick<Database, 'insert' | 'update' | 'delete'>;

export class ExerciseWriteError extends Error {
  readonly kind:
    'name_conflict' | 'conflict' | 'invalid_reference' | 'not_found';
  readonly changeIndex?: number;

  constructor(
    kind: ExerciseWriteError['kind'],
    options: ErrorOptions & { changeIndex?: number },
  ) {
    super(`Exercise write failed: ${kind}`, options);
    this.name = 'ExerciseWriteError';
    this.kind = kind;
    this.changeIndex = options.changeIndex;
  }
}

function translateExerciseWriteError(
  error: unknown,
  changeIndex?: number,
): never {
  if (error instanceof ExerciseWriteError) throw error;

  let cause = error;

  while (cause instanceof Error) {
    if ('code' in cause && cause.code === '23505') {
      const constraint = 'constraint' in cause ? cause.constraint : undefined;
      const kind =
        constraint === 'exercise_name_unique' ? 'name_conflict' : 'conflict';

      throw new ExerciseWriteError(kind, { cause: error, changeIndex });
    }

    if ('code' in cause && cause.code === '23503') {
      throw new ExerciseWriteError('invalid_reference', {
        cause: error,
        changeIndex,
      });
    }

    cause = cause.cause;
  }

  throw error;
}

function exerciseValues(input: ExerciseInput) {
  return {
    name: input.name,
    equipment_id: input.equipmentId,
    grip_orientation: input.gripOrientation,
    grip_width: input.gripWidth,
    is_unilateral: input.isUnilateral,
    mechanics: input.mechanics,
  };
}

async function insertExercise(db: ExerciseWriter, input: ExerciseInput) {
  const [createdExercise] = await db
    .insert(exercise)
    .values(exerciseValues(input))
    .returning({ id: exercise.id });

  if (!createdExercise) {
    throw new Error('Exercise creation did not return a record');
  }

  await insertMuscles(db, createdExercise.id, input.muscles);
  await insertMovementPatterns(
    db,
    createdExercise.id,
    input.movementPatternIds,
  );
  return createdExercise;
}

async function insertMuscles(
  db: ExerciseWriter,
  exerciseId: string,
  muscles: ExerciseInput['muscles'],
) {
  if (muscles.length === 0) return;

  await db
    .insert(exercise_muscle)
    .values(
      muscles.map(({ muscleId, role }) => ({
        exercise_id: exerciseId,
        muscle_id: muscleId,
        role,
      })),
    );
}

async function insertMovementPatterns(
  db: ExerciseWriter,
  exerciseId: string,
  movementPatternIds: number[] = [],
) {
  if (movementPatternIds.length === 0) return;

  await db
    .insert(exercise_movement_pattern)
    .values(
      movementPatternIds.map((movementPatternId) => ({
        exercise_id: exerciseId,
        movement_pattern_id: movementPatternId,
      })),
    );
}

async function editExercise(
  db: ExerciseWriter,
  id: string,
  input: ExerciseInput,
) {
  const [updatedExercise] = await db
    .update(exercise)
    .set(exerciseValues(input))
    .where(eq(exercise.id, id))
    .returning({ id: exercise.id });

  if (!updatedExercise) return null;

  await db.delete(exercise_muscle).where(eq(exercise_muscle.exercise_id, id));
  await insertMuscles(db, id, input.muscles);

  // Omitted assignments preserve existing links; an empty list clears them.
  if (input.movementPatternIds !== undefined) {
    await db
      .delete(exercise_movement_pattern)
      .where(eq(exercise_movement_pattern.exercise_id, id));
    await insertMovementPatterns(db, id, input.movementPatternIds);
  }

  return updatedExercise;
}

export async function createExercise(db: Database, input: ExerciseInput) {
  return db
    .transaction((tx) => insertExercise(tx, input))
    .catch((error: unknown) => translateExerciseWriteError(error));
}

export async function updateExercise(
  db: Database,
  id: string,
  input: ExerciseInput,
) {
  return db
    .transaction((tx) => editExercise(tx, id, input))
    .catch((error: unknown) => translateExerciseWriteError(error));
}

export async function saveExercises(db: Database, changes: ExerciseChange[]) {
  return db.transaction(async (tx) => {
    const saved: { id: string }[] = [];

    for (const [changeIndex, change] of changes.entries()) {
      try {
        const result =
          change.id === undefined ?
            await insertExercise(tx, change)
          : await editExercise(tx, change.id, change);

        if (!result) {
          throw new ExerciseWriteError('not_found', {
            cause: new Error('Exercise no longer exists'),
            changeIndex,
          });
        }

        saved.push(result);
      } catch (error) {
        translateExerciseWriteError(error, changeIndex);
      }
    }

    return saved;
  });
}

export async function listExercises(db: Database) {
  const exercises = await db.query.exercise.findMany({
    columns: {
      id: true,
      name: true,
      grip_orientation: true,
      grip_width: true,
      is_unilateral: true,
      mechanics: true,
    },
    with: {
      equipment: { columns: { id: true, name: true } },
      movementPatterns: {
        columns: {},
        with: { movementPattern: { columns: { id: true, name: true } } },
      },
      muscles: {
        columns: { role: true },
        with: { muscle: { columns: { id: true, name: true } } },
      },
    },
    orderBy: (exercise, { asc }) => [asc(exercise.name), asc(exercise.id)],
  });

  return exercises.map((exercise) => ({
    id: exercise.id,
    name: exercise.name,
    equipment: exercise.equipment,
    gripOrientation: exercise.grip_orientation,
    gripWidth: exercise.grip_width,
    isUnilateral: exercise.is_unilateral,
    mechanics: exercise.mechanics,
    movementPatterns: exercise.movementPatterns
      .map(({ movementPattern }) => movementPattern)
      .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id),
    muscles: exercise.muscles
      .map(({ muscle, role }) => ({ ...muscle, role }))
      .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id),
  }));
}
