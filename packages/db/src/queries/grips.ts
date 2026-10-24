import type { Database } from '../index.js';

export async function listGrips(db: Database) {
  return db.query.exercise_grip.findMany({
    columns: { id: true, code: true, name: true },
    orderBy: (grip, { asc }) => [asc(grip.name), asc(grip.id)],
  });
}
