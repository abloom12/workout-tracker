import type { movement_pattern } from '../schemas/exercise.js';

export const movementPatterns = [
  { name: 'Squat' },
  { name: 'Hinge' },
  { name: 'Horizontal Push' },
  { name: 'Vertical Push' },
  { name: 'Horizontal Pull' },
  { name: 'Vertical Pull' },
] satisfies (typeof movement_pattern.$inferInsert)[];
