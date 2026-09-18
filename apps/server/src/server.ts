import Fastify from 'fastify';

import { app } from './app.js';
import { config } from './env.js';

async function main() {
  const server = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: { translateTime: 'HH:MM:ss Z', ignore: 'pid,hostname' },
      },
    },
    routerOptions: { maxParamLength: 5000 },
  });

  await server.register(app);

  const close = async (signal: NodeJS.Signals) => {
    server.log.info({ signal }, 'shutting down');

    try {
      await server.close();
      process.exit(0);
    } catch (error) {
      server.log.error(error);
      process.exit(1);
    }
  };

  let isClosing = false;

  const handleSignal = (signal: NodeJS.Signals) => {
    if (isClosing) return;
    isClosing = true;

    void close(signal);
  };

  process.once('SIGINT', handleSignal);
  process.once('SIGTERM', handleSignal);

  try {
    const address = await server.listen({
      port: config.port,
      host: config.host,
    });

    server.log.info(`server listening on ${address}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

void main();
