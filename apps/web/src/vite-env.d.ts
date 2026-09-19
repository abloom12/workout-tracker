/// <reference types="vite/client" />

/* eslint-disable @typescript-eslint/consistent-type-definitions -- Vite environment types require
 declaration merging. */

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
}
