import type { exercise_attachment } from '../schemas/exercise.js';

export const attachments = [
  { name: 'Rope' },
  { name: 'Straight Bar' },
  { name: 'Lat Bar' },
  { name: 'EZ-Curl Bar' },
  { name: 'D-Handle' },
  { name: 'V-Bar' },
  { name: 'Tricep Strap' },
] satisfies (typeof exercise_attachment.$inferInsert)[];
