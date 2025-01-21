/* eslint-disable @typescript-eslint/require-await */
import type { FastifyInstance } from 'fastify';
import fastifyMultipart from 'fastify-multipart';

import { UserController, VideoController } from '@/adapters/controllers';
import {
  AuthTokenGateway,
  UserGateway,
  VideoGateway,
} from '@/adapters/gateways';
import {
  authenticationMiddleware,
  stateMiddleware,
} from '@/adapters/middlewares';
import {
  AuthenticationUseCase,
  UserUseCase,
  VideoUseCase,
} from '@/application/usecases';
import { AuthToken } from '@/infra/authToken';
import {
  UserDbConnection,
  VideoDbConnection,
} from '@/infra/database/mongodb/db-connections';
import type { HttpRequest } from '@/interfaces/http';

const apiRoutes = async (app: FastifyInstance): Promise<void> => {
  await app.register(fastifyMultipart);

  const authToken = new AuthToken();
  const authTokenGateway = new AuthTokenGateway(authToken);
  const authenticationUseCase = new AuthenticationUseCase(authTokenGateway);

  const userDbConnection = new UserDbConnection();
  const userGateway = new UserGateway(userDbConnection);
  const userUseCase = new UserUseCase(userGateway, authTokenGateway);
  const userController = new UserController(userUseCase);

  const videoDbConnection = new VideoDbConnection();
  const videoGateway = new VideoGateway(videoDbConnection);
  const videoUseCase = new VideoUseCase(videoGateway);
  const videoController = new VideoController(videoUseCase);

  app.addHook('preHandler', stateMiddleware());
  const authentication = {
    preHandler: authenticationMiddleware(authenticationUseCase),
  };

  app.post('/login', async (request, reply) => {
    const response = await userController.login(
      request as unknown as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/user', authentication, async (request, reply) => {
    const response = await userController.create(
      request as unknown as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });

  // Videos
  app.get('/videos', authentication, async (request, reply) =>
    reply.send({ message: 'Authenticated', user: request.state.user })
  );

  app.get(
    '/videos/:id/images/download',
    authentication,
    async (request, reply) =>
      reply.send({ message: 'Authenticated', user: request.state.user })
  );

  app.post('/videos/upload', authentication, async (request, reply) => {
    const response = await videoController.upload(
      request as unknown as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });
};

export default apiRoutes;
