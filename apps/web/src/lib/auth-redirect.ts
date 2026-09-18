import { z } from 'zod';

export const defaultAuthRedirect = '/' as const;

const authRedirects = [defaultAuthRedirect, '/settings'] as const;

export const authSearchSchema = z.object({
  redirect: z.enum(authRedirects).optional(),
});

export type AuthRedirect = z.infer<typeof authSearchSchema>['redirect'];

export function getAuthRedirect(redirect: AuthRedirect) {
  return redirect ?? defaultAuthRedirect;
}
