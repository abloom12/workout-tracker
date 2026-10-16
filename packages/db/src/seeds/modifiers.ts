import type { modifier } from '../schemas/modifier.js';

export const modifiers = [
  { code: 'chains', name: 'Chains', value_kind: 'weight' },
  { code: 'weighted_vest', name: 'Weighted Vest', value_kind: 'weight' },
  { code: 'pause', name: 'Pause', value_kind: 'duration' },
  { code: 'negatives', name: 'Negatives', value_kind: 'none' },
] satisfies (typeof modifier.$inferInsert)[];
