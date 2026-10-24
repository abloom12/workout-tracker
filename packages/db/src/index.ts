import { drizzle } from 'drizzle-orm/node-postgres';

import * as schema from './schema.js';

export { listAttachments } from './queries/attachments.js';
export { listEquipment } from './queries/equipment.js';
export {
  createExerciseSetup,
  listExercises,
  listExerciseSetups,
  updateExerciseSetup,
} from './queries/exercises.js';
export { listGrips } from './queries/grips.js';
export { listModifiers } from './queries/modifiers.js';
export { listMuscles } from './queries/muscles.js';
export * from './schema.js';

export function createDB(databaseURL: string) {
  return drizzle(databaseURL, { schema });
}

export type Database = ReturnType<typeof createDB>;
