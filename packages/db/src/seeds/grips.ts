import type { exercise_grip } from '../schemas/exercise.js';

export const grips = [
  { name: 'Standard' },
  { name: 'Close' },
  { name: 'Wide' },
  { name: 'Neutral' },
  { name: 'Underhand' },
] satisfies (typeof exercise_grip.$inferInsert)[];
