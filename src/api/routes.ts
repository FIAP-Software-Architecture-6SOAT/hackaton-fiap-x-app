/* eslint-disable @typescript-eslint/require-await */
import fastifyMultipart from '@fastify/multipart';
import type { FastifyInstance } from 'fastify';

import { UserController, VideoController } from '@/adapters/controllers';
import {
  AuthTokenGateway,
  S3Gateway,
  SQSGateway,
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
  const s3Gateway = new S3Gateway();
  const sqsGateway = new SQSGateway();
  const videoUseCase = new VideoUseCase(videoGateway, s3Gateway, sqsGateway);
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
    '/videos/:id/download/images',
    authentication,
    async (request, reply) => {
      const response = await videoController.downloadImages(
        request as unknown as HttpRequest
      );
      return reply.status(response.statusCode).send(response.data);
    }
  );

  app.post('/videos/upload', authentication, async (request, reply) => {
    const response = await videoController.upload(
      request as unknown as HttpRequest
    );
    return reply.status(response.statusCode).send(response.data);
  });
};

export default apiRoutes;
