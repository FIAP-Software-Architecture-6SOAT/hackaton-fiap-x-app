/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';

import { AuthTokenGateway } from '@/adapters/gateways/authToken';
import type { AuthToken } from '@/infra/authToken';

describe('AuthTokenGateway', () => {
  let authToken: MockProxy<AuthToken>;
  let authTokenGateway: AuthTokenGateway;

  beforeEach(() => {
    authToken = mock<AuthToken>();
    authTokenGateway = new AuthTokenGateway(authToken);
  });

  describe('authenticate', () => {
    it('should authenticate a valid token and return the user payload', () => {
      const token = 'valid-token';
      const payload = { id: 'user-id', email: 'test@example.com' };

      authToken.verifyToken.mockReturnValue(true);
      authToken.getPayload.mockReturnValue(payload);

      const result = authTokenGateway.authenticate(token);

      expect(authToken.verifyToken).toHaveBeenCalledWith(token);
      expect(authToken.getPayload).toHaveBeenCalled();
      expect(result).toEqual(payload);
    });

    it('should return false for an invalid token', () => {
      const token = 'invalid-token';

      authToken.verifyToken.mockReturnValue(false);

      const result = authTokenGateway.authenticate(token);

      expect(authToken.verifyToken).toHaveBeenCalledWith(token);
      expect(result).toBe(false);
    });
  });

  describe('generateToken', () => {
    it('should generate a token for the given payload', () => {
      const payload = { id: 'user-id', email: 'test@example.com' };
      const token = 'generated-token';

      authToken.generateToken.mockReturnValue(token);

      const result = authTokenGateway.generateToken(payload);

      expect(authToken.generateToken).toHaveBeenCalledWith(payload);
      expect(result).toBe(token);
    });
  });
});
