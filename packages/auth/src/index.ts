import type { Auth, BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';

import type { AuthOptions } from './options.js';
import { createAuthOptions } from './options.js';

type AuthDb = Parameters<typeof drizzleAdapter>[0];
type AuthInstance = Auth<BetterAuthOptions>;

export function createAuth(db: AuthDb, options: AuthOptions): AuthInstance {
  const authOptions: BetterAuthOptions = {
    ...createAuthOptions(options),
    database: drizzleAdapter(db, { provider: 'pg' }),
  };

  return betterAuth(authOptions);
}
