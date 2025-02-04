/* eslint-disable @typescript-eslint/no-floating-promises */
import type { FastifyRequest } from 'fastify';

import { stateMiddleware } from '@/adapters/middlewares';

describe('stateMiddleware', () => {
  it('should add state to the request object', () => {
    const req = {} as unknown as FastifyRequest & { state?: Record<string, unknown> };

    stateMiddleware()(req);

    expect(req.state).toBeDefined();
  });
});
