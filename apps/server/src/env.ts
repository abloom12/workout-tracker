import { z } from 'zod';

import 'dotenv/config';

const EnvSchema = z.object({
  APP_ORIGIN: z.url(),
  CORS_ORIGIN: z.string().min(1),
  HOST: z.string(),
  PORT: z.coerce.number().int().positive(),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  // database
  DATABASE_URL: z.string().min(1),
  // auth
  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.url(),
});

const env = EnvSchema.parse(process.env);

export const config = {
  appOrigin: env.APP_ORIGIN,
  corsOrigin: env.CORS_ORIGIN.split(',')
    .map((s: string) => s.trim())
    .filter(Boolean),
  host: env.HOST,
  port: env.PORT,
  database: { url: env.DATABASE_URL },
  auth: {
    baseUrl: env.BETTER_AUTH_URL,
    secret: env.BETTER_AUTH_SECRET,
  },
  isProd: env.NODE_ENV === 'production',
} as const;
