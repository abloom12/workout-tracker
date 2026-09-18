import type { Auth, BetterAuthOptions } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { betterAuth } from 'better-auth/minimal';
import { z } from 'zod';

type AuthDb = Parameters<typeof drizzleAdapter>[0];
type AuthInstance = Auth<BetterAuthOptions>;

const _authOptionsSchema = z.looseObject({
  appOrigin: z.url(),
  baseURL: z.url().optional(),
  googleClientId: z.string().min(1).optional(),
  googleClientSecret: z.string().min(1).optional(),
  isProd: z.boolean(),
  secret: z.string(),
});

type AuthOptions = BetterAuthOptions & z.infer<typeof _authOptionsSchema>;

export function createAuth(db: AuthDb, options: AuthOptions): AuthInstance {
  const authOptions: BetterAuthOptions = {
    appName: 'API',
    advanced: { database: { generateId: 'uuid' } },
    baseURL: options.baseURL,
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
      requireEmailVerification: false, // turn on once we get postmark setup
      revokeSessionsOnPasswordReset: true,
      customSyntheticUser: ({ coreFields, additionalFields, id }) => ({
        ...coreFields,
        // add plugin fields here
        // Admin plugin fields (in schema order)
        role: 'user', // or your configured defaultRole
        banned: false,
        banReason: null,
        banExpires: null,
        ...additionalFields,
        id,
      }),
      // onExistingUserSignUp: async (_data, _request) => {}, // turn on with requireEmailVerification
      // sendResetPassword: async (_data, _request) => {}, // turn on with requireEmailVerification
      // onPasswordReset: async (_data, _request) => {}, // turn on with requireEmailVerification
    },
    // emailVerification: { sendVerificationEmail: async () => {} }, // turn on with requireEmailVerification
    trustedOrigins: [options.appOrigin],
    session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
    secret: options.secret,
  };

  return betterAuth(authOptions);
}
