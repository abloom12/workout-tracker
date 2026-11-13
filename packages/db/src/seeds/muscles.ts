import type { muscle } from '../schemas/exercise.js';

export const muscles = [
  { name: 'Chest' },
  { name: 'Lats' },
  { name: 'Traps' },
  { name: 'Upper Back' },
  { name: 'Lower Back' },
  { name: 'Front Delts' },
  { name: 'Side Delts' },
  { name: 'Rear Delts' },
  { name: 'Biceps' },
  { name: 'Triceps' },
  { name: 'Forearms' },
  { name: 'Quads' },
  { name: 'Hamstrings' },
  { name: 'Glutes' },
  { name: 'Adductors' },
  { name: 'Calves' },
  { name: 'Core' },
] satisfies (typeof muscle.$inferInsert)[];
