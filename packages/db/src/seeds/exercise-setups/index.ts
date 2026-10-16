import { backSetups } from './back.js';
import { bicepsSetups } from './biceps.js';
import { chestSetups } from './chest.js';
import { coreSetups } from './core.js';
import { legSetups } from './legs.js';
import { olympicLiftSetups } from './olympic-lifts.js';
import { shoulderSetups } from './shoulders.js';
import { tricepsSetups } from './triceps.js';

export const exerciseSetups = [
  ...chestSetups,
  ...backSetups,
  ...shoulderSetups,
  ...bicepsSetups,
  ...tricepsSetups,
  ...legSetups,
  ...coreSetups,
  ...olympicLiftSetups,
];
