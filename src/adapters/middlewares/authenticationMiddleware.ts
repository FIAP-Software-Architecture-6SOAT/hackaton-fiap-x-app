/* eslint-disable consistent-return */
import type { FastifyReply, FastifyRequest } from 'fastify';

import type { AuthenticationUseCase } from '@/application/usecases';

export const authenticationMiddleware =
  (authenticationUseCase: AuthenticationUseCase) =>
  async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { authorization } = request.headers;

    if (!authorization)
      return reply
        .status(401)
        .send({ message: 'Missing Authorization Header' });

    const [schema, token] = authorization.split(' ');

    if (!schema || !token) {
      return reply
        .status(401)
        .send({ message: 'Invalid Authorization Header' });
    }

    if (schema !== 'Bearer') {
      return reply.status(401).send({ message: 'Invalid schema' });
    }

    const payload = authenticationUseCase.authenticate(token);
    if (!payload) return reply.status(401).send({ message: 'Unauthorized' });

    Object.assign(request, {
      state: {
        user: { id: payload.id, email: payload.email },
      },
    });
  };
