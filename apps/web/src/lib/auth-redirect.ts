import { z } from 'zod';

export const defaultAuthRedirect = '/dashboard' as const;

const authRedirects = [defaultAuthRedirect, '/settings'] as const;

export const authSearchSchema = z.object({
  redirect: z.enum(authRedirects).optional(),
});

export type AuthRedirect = (typeof authRedirects)[number];

export function getAuthRedirect(redirect: string | undefined): AuthRedirect {
  return (
    authRedirects.find((candidate) => candidate === redirect) ??
    defaultAuthRedirect
  );
}
