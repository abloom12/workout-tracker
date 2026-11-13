import type { Database } from '../index.js';

export async function getUserAccess(db: Database, userId: string) {
  return db.query.user.findFirst({
    columns: { role: true, banned: true },
    where: (user, { eq }) => eq(user.id, userId),
  });
}
