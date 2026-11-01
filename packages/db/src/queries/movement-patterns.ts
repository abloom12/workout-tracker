import type { Database } from '../index.js';

export async function listMovementPatterns(db: Database) {
  return db.query.movement_pattern.findMany({
    columns: { id: true, name: true },
    orderBy: (movementPattern, { asc }) => [
      asc(movementPattern.name),
      asc(movementPattern.id),
    ],
  });
}
