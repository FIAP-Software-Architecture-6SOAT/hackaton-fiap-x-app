/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';

import { authenticationMiddleware } from '@/adapters/middlewares';
import type { AuthenticationUseCase } from '@/application/usecases/authentication';

describe('authenticationMiddleware', () => {
  let authenticationUseCase: MockProxy<AuthenticationUseCase>;
  let req: MockProxy<FastifyRequest & { state: Record<string, unknown> }>;
  let res: MockProxy<FastifyReply>;

  beforeEach(() => {
    authenticationUseCase = mock<AuthenticationUseCase>();
    req = mock<FastifyRequest & { state: Record<string, unknown> }>();
    res = mock<FastifyReply>();
    res.status.mockReturnThis();
    res.send.mockReturnThis();
  });

  it('should call next if the token is valid', async () => {
    const token = 'valid-token';
    const user = { id: 'user-id', email: 'test@example.com' };

    req.headers.authorization = `Bearer ${token}`;
    authenticationUseCase.authenticate.mockReturnValue(user);

    await authenticationMiddleware(authenticationUseCase)(req, res);

    expect(authenticationUseCase.authenticate).toHaveBeenCalledWith(token);
    expect(req.state.user).toEqual(user);
  });

  it('should return 401 if the token is invalid', async () => {
    const token = 'invalid-token';

    req.headers.authorization = `Bearer ${token}`;
    authenticationUseCase.authenticate.mockReturnValue(false);

    await authenticationMiddleware(authenticationUseCase)(req, res);

    expect(authenticationUseCase.authenticate).toHaveBeenCalledWith(token);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Unauthorized' });
  });

  it('should return 401 if the authorization header is missing', async () => {
    await authenticationMiddleware(authenticationUseCase)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Missing Authorization Header' });
  });

  it('should return 401 if the schema is invalid', async () => {
    req.headers.authorization = 'InvalidSchema token';

    await authenticationMiddleware(authenticationUseCase)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid schema' });
  });

  it('should return 401 if the authorization header is invalid', async () => {
    req.headers.authorization = 'Bearer';

    await authenticationMiddleware(authenticationUseCase)(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ message: 'Invalid Authorization Header' });
  });
});
