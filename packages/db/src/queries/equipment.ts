import type { Database } from '../index.js';

export async function listEquipment(db: Database) {
  return db.query.exercise_equipment.findMany({
    columns: { id: true, code: true, name: true },
    orderBy: (equipment, { asc }) => [asc(equipment.name), asc(equipment.id)],
  });
}
