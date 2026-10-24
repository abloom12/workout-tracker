import type { Database } from '../index.js';

export async function listAttachments(db: Database) {
  return db.query.exercise_attachment.findMany({
    columns: { id: true, code: true, name: true },
    orderBy: (attachment, { asc }) => [
      asc(attachment.name),
      asc(attachment.id),
    ],
  });
}
