import type { FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import type { FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyHelmet from '@fastify/helmet';
import fastifyRateLimit from '@fastify/rate-limit';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { fromNodeHeaders } from 'better-auth/node';

import type { AppRouter } from '@acme/api';
import { createApi } from '@acme/api';
import { createAuth } from '@acme/auth';
import { createDB } from '@acme/db';

import { config } from './env.js';

type TrpcOptions = FastifyTRPCPluginOptions<AppRouter>['trpcOptions'];
type TrpcOnError = Parameters<NonNullable<TrpcOptions['onError']>>[0];

export const app: FastifyPluginAsync = async (server) => {
  const db = createDB(config.database.url);
  const auth = createAuth(db, {
    appOrigin: config.appOrigin,
    baseURL: config.auth.baseUrl,
    secret: config.auth.secret,
    googleClientId: config.auth.googleClientId,
    googleClientSecret: config.auth.googleClientSecret,
    isProd: config.isProd,
  });
  const { appRouter, createContext } = createApi(auth);

  await server.register(fastifyCors, {
    origin: config.corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
    credentials: true,
    maxAge: 86400,
  });

  await server.register(fastifyHelmet);
  await server.register(fastifyRateLimit, { max: 100, timeWindow: '1 minute' });

  await server.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }: TrpcOnError) {
        server.log.error(
          `Error in tRPC handler on path '${path}':${error.message}`,
        );
      },
    } satisfies TrpcOptions,
  });

  server.route({
    method: ['GET', 'POST'],
    url: '/api/auth/*',
    handler: async (request, reply) => {
      try {
        // Construct request URL
        const url = new URL(request.url, config.auth.baseUrl);

        // Create Fetch API-compatible request
        const req = new Request(url.toString(), {
          method: request.method,
          headers: fromNodeHeaders(request.headers),
          ...(request.body ? { body: JSON.stringify(request.body) } : {}),
        });

        // Process authentication request
        const response = await auth.handler(req);

        // Forward response to client
        reply.status(response.status);
        response.headers.forEach((value, key) => {
          reply.header(key, value);
        });
        return reply.send(response.body ? await response.text() : null);
      } catch (error) {
        server.log.error(
          `Authentication Error: ${error instanceof Error ? error.message : String(error)}`,
        );

        return reply
          .status(500)
          .send({
            error: 'Internal authentication error',
            code: 'AUTH_FAILURE',
          });
      }
    },
  });
};
