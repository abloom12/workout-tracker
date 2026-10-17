import { expect, test } from 'vitest';

import { attachments } from '../seeds/attachments.js';
import { equipment } from '../seeds/equipment.js';
import { exerciseSetups } from '../seeds/exercise-setups/index.js';
import { exercises } from '../seeds/exercises.js';
import { grips } from '../seeds/grips.js';
import { modifiers } from '../seeds/modifiers.js';

const catalogues = [
  { collection: 'exercises', entries: exercises },
  { collection: 'equipment', entries: equipment },
  { collection: 'grips', entries: grips },
  { collection: 'attachments', entries: attachments },
  { collection: 'modifiers', entries: modifiers },
  { collection: 'exercise setups', entries: exerciseSetups },
];

test.each(catalogues)(
  '$collection has unique codes',
  ({ collection, entries }) => {
    const entriesByCode = new Map<
      string,
      { position: number; name: string }[]
    >();

    entries.forEach((entry, index) => {
      const matches = entriesByCode.get(entry.code) ?? [];
      matches.push({ position: index + 1, name: entry.name });
      entriesByCode.set(entry.code, matches);
    });

    const duplicates = [...entriesByCode]
      .filter(([, matches]) => matches.length > 1)
      .map(([code, matches]) => ({ code, entries: matches }));

    expect(
      duplicates,
      `Duplicate codes in ${collection}; entry positions are one-based`,
    ).toEqual([]);
  },
);
