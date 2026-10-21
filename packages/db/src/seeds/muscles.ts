import type { muscle } from '../schemas/exercise.js';

export const muscles = [
  { code: 'chest', name: 'Chest' },
  { code: 'back', name: 'Back' },
  { code: 'front_delts', name: 'Front Delts' },
  { code: 'middle_delts', name: 'Middle Delts' },
  { code: 'rear_delts', name: 'Rear Delts' },
  { code: 'biceps', name: 'Biceps' },
  { code: 'triceps', name: 'Triceps' },
  { code: 'forearms', name: 'Forearms' },
  { code: 'quads', name: 'Quads' },
  { code: 'hamstrings', name: 'Hamstrings' },
  { code: 'glutes', name: 'Glutes' },
  { code: 'calves', name: 'Calves' },
  { code: 'core', name: 'Core' },
] satisfies (typeof muscle.$inferInsert)[];
