/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { UserUseCase } from '@/application/usecases';
import type { HttpRequest, HttpResponse } from '@/domain/interfaces/http';

@injectable()
export class UserController {
  public constructor(@inject('UserUseCase') private readonly userUseCase: UserUseCase) {}

  public async create(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body;

      if (!email && !password) {
        return {
          data: {
            err: 'Email and password are required',
          },
          statusCode: 400,
        };
      }

      const userId = await this.userUseCase.create({
        email,
        password,
      });

      return {
        data: {
          id: userId,
        },
        statusCode: 201,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }

  public async login(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { email, password } = request.body;

      if (!email && !password) {
        return {
          data: {
            err: 'Email and password are required',
          },
          statusCode: 400,
        };
      }

      const token = await this.userUseCase.login({
        email,
        password,
      });

      return {
        data: {
          token,
        },
        statusCode: 200,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }
}
