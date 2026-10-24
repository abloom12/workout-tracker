import type { Database } from '../index.js';

export async function listMuscles(db: Database) {
  return db.query.muscle.findMany({
    columns: { id: true, code: true, name: true },
    orderBy: (muscle, { asc }) => [asc(muscle.name), asc(muscle.id)],
  });
}
