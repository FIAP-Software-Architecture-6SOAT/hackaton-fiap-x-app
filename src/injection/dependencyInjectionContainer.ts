import 'reflect-metadata';

import { container } from 'tsyringe';

import { UserController, VideoController } from '@/adapters/controllers';
import {
  AuthTokenGateway,
  S3Gateway,
  SQSGateway,
  UserGateway,
  VideoGateway,
} from '@/adapters/gateways';
import { AuthenticationUseCase, UserUseCase, VideoUseCase } from '@/application/usecases';
import { AuthToken } from '@/infra/authToken';
import { UserDbConnection, VideoDbConnection } from '@/infra/database/mongodb/db-connections';

container.register('AuthToken', { useClass: AuthToken });
container.register('AuthTokenGateway', { useClass: AuthTokenGateway });
container.register('AuthenticationUseCase', { useClass: AuthenticationUseCase });

container.register('VideoDbConnection', { useClass: VideoDbConnection });
container.register('VideoGateway', { useClass: VideoGateway });
container.register('CloudStorageGateway', { useClass: S3Gateway });
container.register('QueueGateway', { useClass: SQSGateway });
container.register('VideoUseCase', { useClass: VideoUseCase });
container.register('VideoController', { useClass: VideoController });

container.register('UserDbConnection', { useClass: UserDbConnection });
container.register('UserGateway', { useClass: UserGateway });
container.register('UserUseCase', { useClass: UserUseCase });
container.register('UserController', { useClass: UserController });
