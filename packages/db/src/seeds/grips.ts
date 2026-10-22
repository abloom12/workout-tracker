import type { exercise_grip } from '../schemas/exercise.js';

export const grips = [
  { code: 'none', name: 'None' },
  { code: 'overhand', name: 'Overhand' },
  { code: 'close', name: 'Close' },
  { code: 'wide', name: 'Wide' },
  { code: 'neutral', name: 'Neutral' },
  { code: 'underhand', name: 'Underhand' },
  { code: 'mixed', name: 'Mixed' },
  { code: 'hook', name: 'Hook' },
  { code: 'false', name: 'False' },
] satisfies (typeof exercise_grip.$inferInsert)[];
