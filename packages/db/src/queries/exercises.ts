import { eq } from 'drizzle-orm';

import type { Database } from '../index.js';
import { exercise, exercise_muscle } from '../schema.js';

export type ExerciseInput = {
  name: string;
  equipmentId: number;
  muscles: {
    muscleId: number;
    role: (typeof exercise_muscle.$inferSelect)['role'];
  }[];
};

export type ExerciseChange = ExerciseInput &
  ({ id: number } | { code: string });

type ExerciseWriter = Pick<Database, 'insert' | 'update' | 'delete'>;

export class ExerciseWriteError extends Error {
  readonly kind:
    | 'code_conflict'
    | 'name_conflict'
    | 'conflict'
    | 'invalid_reference'
    | 'not_found';
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
        constraint === 'exercise_code_unique' ? 'code_conflict'
        : constraint === 'exercise_name_unique' ? 'name_conflict'
        : 'conflict';

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
  return { name: input.name, equipment_id: input.equipmentId };
}

async function insertExercise(
  db: ExerciseWriter,
  input: ExerciseInput & { code: string },
) {
  const [createdExercise] = await db
    .insert(exercise)
    .values({ ...exerciseValues(input), code: input.code })
    .returning({ id: exercise.id, code: exercise.code });

  if (!createdExercise) {
    throw new Error('Exercise creation did not return a record');
  }

  await insertMuscles(db, createdExercise.id, input.muscles);
  return createdExercise;
}

async function insertMuscles(
  db: ExerciseWriter,
  exerciseId: number,
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

async function editExercise(
  db: ExerciseWriter,
  id: number,
  input: ExerciseInput,
) {
  const [updatedExercise] = await db
    .update(exercise)
    .set(exerciseValues(input))
    .where(eq(exercise.id, id))
    .returning({ id: exercise.id, code: exercise.code });

  if (!updatedExercise) return null;

  await db.delete(exercise_muscle).where(eq(exercise_muscle.exercise_id, id));
  await insertMuscles(db, id, input.muscles);
  return updatedExercise;
}

export async function createExercise(
  db: Database,
  input: ExerciseInput & { code: string },
) {
  return db
    .transaction((tx) => insertExercise(tx, input))
    .catch((error: unknown) => translateExerciseWriteError(error));
}

export async function updateExercise(
  db: Database,
  id: number,
  input: ExerciseInput,
) {
  return db
    .transaction((tx) => editExercise(tx, id, input))
    .catch((error: unknown) => translateExerciseWriteError(error));
}

export async function saveExercises(db: Database, changes: ExerciseChange[]) {
  return db.transaction(async (tx) => {
    const saved: { id: number; code: string }[] = [];

    for (const [changeIndex, change] of changes.entries()) {
      try {
        const result =
          'id' in change ?
            await editExercise(tx, change.id, change)
          : await insertExercise(tx, change);

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
    columns: { id: true, code: true, name: true },
    with: {
      equipment: { columns: { id: true, code: true, name: true } },
      muscles: {
        columns: { role: true },
        with: { muscle: { columns: { id: true, code: true, name: true } } },
      },
    },
    orderBy: (exercise, { asc }) => [asc(exercise.name), asc(exercise.id)],
  });

  return exercises.map((exercise) => ({
    id: exercise.id,
    code: exercise.code,
    name: exercise.name,
    equipment: exercise.equipment,
    muscles: exercise.muscles
      .map(({ muscle, role }) => ({ ...muscle, role }))
      .sort((a, b) => a.name.localeCompare(b.name) || a.id - b.id),
  }));
}
