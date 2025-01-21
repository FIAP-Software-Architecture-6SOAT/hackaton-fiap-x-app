/* eslint-disable @typescript-eslint/require-await */
import type { FastifyRequest } from 'fastify';

export const stateMiddleware =
  () =>
  async (request: FastifyRequest): Promise<void> => {
    Object.assign(request, { state: {} });
  };
