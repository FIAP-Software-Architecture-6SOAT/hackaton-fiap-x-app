import fastifyMultipart from '@fastify/multipart';
import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import { UserController, VideoController } from '@/adapters/controllers';
import { authenticationMiddleware, stateMiddleware } from '@/adapters/middlewares';
import { AuthenticationUseCase } from '@/application/usecases';
import type { HttpRequest } from '@/interfaces/http';

const apiRoutes = async (app: FastifyInstance): Promise<void> => {
  await app.register(fastifyMultipart);

  const authenticationUseCase = container.resolve(AuthenticationUseCase);
  const userController = container.resolve(UserController);
  const videoController = container.resolve(VideoController);

  app.addHook('preHandler', stateMiddleware());
  const authentication = {
    preHandler: authenticationMiddleware(authenticationUseCase),
  };

  app.post('/auth/login', async (request, reply) => {
    const response = await userController.login(request as unknown as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/user', authentication, async (request, reply) => {
    const response = await userController.create(request as unknown as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });

  app.get('/videos', authentication, async (request, reply) => {
    const response = await videoController.getVideos(request as unknown as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });

  app.get('/videos/:id', authentication, async (request, reply) => {
    const response = await videoController.getVideo(request as unknown as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });

  app.get('/videos/:id/download/images', authentication, async (request, reply) => {
    const response = await videoController.downloadImages(request as unknown as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });

  app.post('/videos/upload', authentication, async (request, reply) => {
    const response = await videoController.upload(request as unknown as HttpRequest);
    return reply.status(response.statusCode).send(response.data);
  });
};

export default apiRoutes;
