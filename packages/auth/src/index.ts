import type { BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';

import type { AuthOptions } from './options.js';
import { createAuthOptions } from './options.js';

type AuthDb = Parameters<typeof drizzleAdapter>[0];

export function createAuth(db: AuthDb, options: AuthOptions) {
  const authOptions = {
    ...createAuthOptions(options),
    database: drizzleAdapter(db, { provider: 'pg' }),
  } satisfies BetterAuthOptions;

  return betterAuth(authOptions);
}
