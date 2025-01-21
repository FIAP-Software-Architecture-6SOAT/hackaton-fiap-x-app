/* eslint-disable consistent-return */
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { AuthenticationUseCase } from '@/application/usecases';

export const authenticationMiddleware =
  (authenticationUseCase: AuthenticationUseCase) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const token = request.headers.authorization;
    if (!token) return reply.status(401).send({ message: 'Unauthorized' });

    const payload = await authenticationUseCase.authenticate(token);
    if (!payload) return reply.status(401).send({ message: 'Unauthorized' });

    Object.assign(request, {
      state: {
        user: { id: payload.id, email: payload.email },
      },
    });
  };
