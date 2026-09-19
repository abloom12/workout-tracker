import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'drizzle-kit';

const configDirectory = dirname(fileURLToPath(import.meta.url));

if (!process.env.DATABASE_URL) {
  loadEnvFile(resolve(configDirectory, '../../apps/server/.env'));
}

const databaseURL = process.env.DATABASE_URL;

if (!databaseURL) {
  throw new Error('DATABASE_URL is required');
}

export default defineConfig({
  schema: './src/schema.ts',
  out: './src/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: databaseURL },
});
