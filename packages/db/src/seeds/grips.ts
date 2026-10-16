import type { exercise_grip } from '../schemas/exercise.js';

export const grips = [
  { code: 'standard', name: 'Standard' },
  { code: 'close', name: 'Close' },
  { code: 'wide', name: 'Wide' },
  { code: 'neutral', name: 'Neutral' },
  { code: 'underhand', name: 'Underhand' },
] satisfies (typeof exercise_grip.$inferInsert)[];
