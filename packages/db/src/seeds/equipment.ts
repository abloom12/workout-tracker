import type { exercise_equipment } from '../schemas/exercise.js';

export const equipment = [
  { name: 'Barbell' },
  { name: 'Dumbbell' },
  { name: 'Cable' },
  { name: 'Bodyweight' },
] satisfies (typeof exercise_equipment.$inferInsert)[];
