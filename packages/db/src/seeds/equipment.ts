import type { exercise_equipment } from '../schemas/exercise.js';

export const equipment = [
  { name: 'Barbell' },
  { name: 'Trap Bar' },
  { name: 'Dumbbell' },
  { name: 'Cable' },
  { name: 'None' },
  { name: 'Parallel Bars' },
  { name: 'Straight Bar' },
  { name: 'Nordic Curl Anchor' },
  { name: 'Olympic Rings' },
] satisfies (typeof exercise_equipment.$inferInsert)[];
