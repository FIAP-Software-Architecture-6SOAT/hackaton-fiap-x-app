/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/init-declarations */
import jwt from 'jsonwebtoken';

import { AuthToken } from '@/infra/authToken';

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn(),
}));

describe('AuthToken', () => {
  let authToken: AuthToken;

  beforeEach(() => {
    authToken = new AuthToken();
  });

  describe('generateToken', () => {
    it('should generate a token for the given payload', () => {
      const payload = { id: 'user-id', email: 'test@example.com' };
      const token = 'generated-token';

      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = authToken.generateToken(payload);

      expect(jwt.sign).toHaveBeenCalledWith(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
      expect(result).toBe(token);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = 'valid-token';
      const payload = { id: 'user-id', email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      const result = authToken.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toBe(true);
    });

    it('should return false for an invalid token', () => {
      const token = 'invalid-token';

      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const result = authToken.verifyToken(token);

      expect(jwt.verify).toHaveBeenCalledWith(token, process.env.JWT_SECRET);
      expect(result).toBe(false);
    });
  });

  describe('getPayload', () => {
    it('should return the payload of the verified token', () => {
      const payload = { id: 'user-id', email: 'test@example.com' };

      (jwt.verify as jest.Mock).mockReturnValue(payload);

      authToken.verifyToken('valid-token');
      const result = authToken.getPayload();

      expect(result).toEqual(payload);
    });
  });
});
