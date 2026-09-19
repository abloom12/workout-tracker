import { betterAuth } from 'better-auth';

import { sharedAuthOptions } from './options.js';

export const auth = betterAuth(sharedAuthOptions);
