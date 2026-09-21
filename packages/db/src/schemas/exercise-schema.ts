import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const exercise = pgTable('exercise', {
  id: integer('id').primaryKey().generatedAlwaysAsIdentity(),
  name: text('name').notNull().unique(),
});
