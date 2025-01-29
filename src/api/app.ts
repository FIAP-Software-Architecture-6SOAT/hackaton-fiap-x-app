import '@/injection/dependencyInjectionContainer';

import dotenv from 'dotenv';
import Fastify from 'fastify';

import { Logger } from '@/infra/logs/logger';

import routes from './routes';

export const App = {
  start: async (): Promise<void> => {
    dotenv.config();
    const app = Fastify({
      connectionTimeout: 180000, // 180 seconds
      bodyLimit: 314572800, // 300MB
      requestTimeout: 180000, // 180 seconds
    });

    await app.register(routes);
    await app.ready();
    await app.listen({
      port: 3000,
      host: '0.0.0.0',
    });
    Logger.info('API IS RUNNING');
  },
};
