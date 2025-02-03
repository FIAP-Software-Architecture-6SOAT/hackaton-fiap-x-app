/* eslint-disable @typescript-eslint/init-declarations */
import 'reflect-metadata';

import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';

import { AuthenticationUseCase } from '@/application/usecases/authentication';
import type { IAuthTokenGateway } from '@/domain/interfaces/gateways';

describe('AuthenticationUseCase', () => {
  let authTokenGateway: MockProxy<IAuthTokenGateway>;
  let authenticationUseCase: AuthenticationUseCase;

  beforeEach(() => {
    authTokenGateway = mock<IAuthTokenGateway>();

    container.clearInstances();
    container.registerInstance('AuthTokenGateway', authTokenGateway);

    authenticationUseCase = container.resolve(AuthenticationUseCase);
  });

  describe('authenticate', () => {
    it('should authenticate a valid token and return the user payload', () => {
      const token = 'valid-token';
      const payload = { id: 'user-id', email: 'test@example.com' };

      authTokenGateway.authenticate.mockReturnValue(payload);

      const result = authenticationUseCase.authenticate(token);

      expect(authTokenGateway.authenticate).toHaveBeenCalledWith(token);
      expect(result).toEqual(payload);
    });

    it('should return false for an invalid token', () => {
      const token = 'invalid-token';

      authTokenGateway.authenticate.mockReturnValue(false);

      const result = authenticationUseCase.authenticate(token);

      expect(authTokenGateway.authenticate).toHaveBeenCalledWith(token);
      expect(result).toBe(false);
    });
  });
});
