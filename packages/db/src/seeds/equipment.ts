import type { exercise_equipment } from '../schemas/exercise.js';

export const equipment = [
  { code: 'barbell', name: 'Barbell' },
  { code: 'dumbbell', name: 'Dumbbell' },
  { code: 'cable', name: 'Cable' },
  { code: 'floor', name: 'Floor' },
  { code: 'parallel_bars', name: 'Parallel Bars' },
  { code: 'fixed_bar', name: 'Fixed Bar' },
  { code: 'bench', name: 'Bench' },
  { code: 'nordic_curl_anchor', name: 'Nordic Curl Anchor' },
  { code: 'olympic_rings', name: 'Olympic Rings' },
] satisfies (typeof exercise_equipment.$inferInsert)[];
