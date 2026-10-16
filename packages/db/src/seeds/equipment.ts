import type { exercise_equipment } from '../schemas/exercise.js';

export const equipment = [
  { code: 'barbell', name: 'Barbell' },
  { code: 'dumbbell', name: 'Dumbbell' },
  { code: 'cable', name: 'Cable' },
  { code: 'bodyweight', name: 'Bodyweight' },
  { code: 'olympic_rings', name: 'Olympic Rings' },
] satisfies (typeof exercise_equipment.$inferInsert)[];
