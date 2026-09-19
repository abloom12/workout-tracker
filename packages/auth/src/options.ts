import type { BetterAuthOptions } from 'better-auth';
import { z } from 'zod';

export const authOptionsSchema = z.object({
  appOrigin: z.url(),
  baseURL: z.url().optional(),
  secret: z.string(),
});

export type AuthOptions = z.infer<typeof authOptionsSchema>;

export const sharedAuthOptions = {
  appName: 'Workout Tracker',
  advanced: { database: { generateId: 'uuid' } },
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 12,
    maxPasswordLength: 128,
    requireEmailVerification: false, // turn on once we get postmark setup
    revokeSessionsOnPasswordReset: true,
    // onExistingUserSignUp: async (_data, _request) => {}, // turn on with requireEmailVerification
    // sendResetPassword: async (_data, _request) => {}, // turn on with requireEmailVerification
    // onPasswordReset: async (_data, _request) => {}, // turn on with requireEmailVerification
  },
  // emailVerification: { sendVerificationEmail: async () => {} }, // turn on with requireEmailVerification
  session: { cookieCache: { enabled: true, maxAge: 60 * 5 } },
} satisfies BetterAuthOptions;

export function createAuthOptions(options: AuthOptions) {
  return {
    ...sharedAuthOptions,
    baseURL: options.baseURL,
    trustedOrigins: [options.appOrigin],
    secret: options.secret,
  } satisfies Omit<BetterAuthOptions, 'database'>;
}
