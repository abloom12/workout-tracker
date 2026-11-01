import type { modifier } from '../schemas/modifier.js';

export const modifiers = [
  { name: 'Chains', value_kind: 'weight' },
  { name: 'Weighted Vest', value_kind: 'weight' },
  { name: 'Pause', value_kind: 'duration' },
  { name: 'Negatives', value_kind: 'none' },
] satisfies (typeof modifier.$inferInsert)[];
