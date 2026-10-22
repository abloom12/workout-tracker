import type { exercise_attachment } from '../schemas/exercise.js';

export const attachments = [
  { code: 'rope', name: 'Rope' },
  { code: 'straight_bar', name: 'Straight Bar' },
  { code: 'lat_bar', name: 'Lat Bar' },
  { code: 'ez_curl_bar', name: 'EZ-Curl Bar' },
  { code: 'd_handle', name: 'D-Handle' },
  { code: 'v_bar', name: 'V-Bar' },
  { code: 'tricep_strap', name: 'Tricep Strap' },
] satisfies (typeof exercise_attachment.$inferInsert)[];
