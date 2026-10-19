import type { Database } from '../index.js';

export async function listExerciseSetups(db: Database) {
  const setups = await db.query.exercise_setup.findMany({
    columns: {
      id: true,
      code: true,
      name: true,
      load_convention: true,
      is_unilateral: true,
    },
    with: {
      exercise: {
        columns: { id: true, code: true, name: true },
      },
      equipment: {
        columns: { id: true, code: true, name: true },
      },
      grip: {
        columns: { id: true, code: true, name: true },
      },
      attachment: {
        columns: { id: true, code: true, name: true },
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
    attachment: setup.attachment,
    loadConvention: setup.load_convention,
    isUnilateral: setup.is_unilateral,
  }));
}
