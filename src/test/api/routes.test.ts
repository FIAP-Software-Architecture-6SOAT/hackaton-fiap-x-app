/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/init-declarations */
/* eslint-disable @typescript-eslint/unbound-method */
import 'reflect-metadata';

import type { FastifyInstance } from 'fastify/types/instance';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';

import { UserController, VideoController } from '@/adapters/controllers';
import apiRoutes from '@/api/routes';
import { AuthenticationUseCase, UserUseCase, VideoUseCase } from '@/application/usecases';

jest.mock('@/infra/logs/logger', () => ({
  Logger: {
    error: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
  },
}));
jest.mock('@/adapters/middlewares', () => ({
  authenticationMiddleware: jest
    .fn()
    .mockReturnValue((req: unknown, res: unknown, next: () => unknown) => next()),
  stateMiddleware: jest
    .fn()
    .mockReturnValue((req: unknown, res: unknown, next: () => unknown) => next()),
}));

describe('apiRoutes', () => {
  let fastifyInstance: MockProxy<FastifyInstance>;
  let authenticationUseCase: MockProxy<AuthenticationUseCase>;
  let userUseCase: MockProxy<UserUseCase>;
  let videoUseCase: MockProxy<VideoUseCase>;
  let userController: MockProxy<UserController>;
  let videoController: MockProxy<VideoController>;

  beforeEach(() => {
    fastifyInstance = mock<FastifyInstance>();
    authenticationUseCase = mock<AuthenticationUseCase>();
    userUseCase = mock<UserUseCase>();
    videoUseCase = mock<VideoUseCase>();
    userController = mock<UserController>();
    videoController = mock<VideoController>();

    jest.clearAllMocks();
    container.clearInstances();

    container.registerInstance(UserUseCase, userUseCase);
    container.registerInstance(AuthenticationUseCase, authenticationUseCase);
    container.registerInstance(UserController, userController);
    container.registerInstance(VideoUseCase, videoUseCase);
    container.registerInstance(VideoController, videoController);
  });

  it('should register routes correctly', async () => {
    await apiRoutes(fastifyInstance);

    expect(fastifyInstance.post).toHaveBeenCalledWith('/auth/login', expect.any(Function));
    expect(fastifyInstance.post).toHaveBeenCalledWith(
      '/user',
      { preHandler: expect.any(Function) },
      expect.any(Function)
    );
    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/videos',
      { preHandler: expect.any(Function) },
      expect.any(Function)
    );
    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/videos/:id',
      { preHandler: expect.any(Function) },
      expect.any(Function)
    );
    expect(fastifyInstance.get).toHaveBeenCalledWith(
      '/videos/:id/download/images',
      { preHandler: expect.any(Function) },
      expect.any(Function)
    );
    expect(fastifyInstance.post).toHaveBeenCalledWith(
      '/videos/upload',
      { preHandler: expect.any(Function) },
      expect.any(Function)
    );
  });

  it('should call login on POST /auth/login', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: {} };

    userController.login.mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.post.mock.calls[0][1];
    await routeHandler(mockRequest, mockReply);

    expect(userController.login).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({});
  });

  it('should call create on POST /user', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: {} };

    userController.create.mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.post.mock.calls[1][2];
    await routeHandler(mockRequest, mockReply);

    expect(userController.create).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({});
  });

  it('should call getVideos on GET /videos', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: [] };

    videoController.getVideos.mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[0][2];
    await routeHandler(mockRequest, mockReply);

    expect(videoController.getVideos).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith([]);
  });

  it('should call getVideo on GET /videos/:id', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: {} };

    videoController.getVideo.mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[1][2];
    await routeHandler(mockRequest, mockReply);

    expect(videoController.getVideo).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({});
  });

  it('should call downloadImages on GET /videos/:id/download/images', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: {} };

    videoController.downloadImages.mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.get.mock.calls[2][2];
    await routeHandler(mockRequest, mockReply);

    expect(videoController.downloadImages).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({});
  });

  it('should call upload on POST /videos/upload', async () => {
    const mockRequest = {} as unknown;
    const mockReply = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    } as unknown;
    const mockResponse = { statusCode: 200, data: {} };

    videoController.upload.mockResolvedValue(mockResponse);

    await apiRoutes(fastifyInstance);
    const routeHandler = fastifyInstance.post.mock.calls[2][2];
    await routeHandler(mockRequest, mockReply);

    expect(videoController.upload).toHaveBeenCalledWith(mockRequest);
    expect(mockReply.status).toHaveBeenCalledWith(200);
    expect(mockReply.send).toHaveBeenCalledWith({});
  });
});
