/* eslint-disable @typescript-eslint/init-declarations */
import 'reflect-metadata';

import bcrypt from 'bcrypt';
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';

import { UserUseCase } from '@/application/usecases/user';
import type { IAuthTokenGateway, IUserGateway } from '@/domain/interfaces/gateways';
import { Email } from '@/domain/value-objects';

jest.mock('bcrypt', () => ({
  hashSync: jest.fn().mockReturnValue('hashed-password'),
  compare: jest.fn().mockResolvedValue(true),
}));

describe('UserUseCase', () => {
  let userGateway: MockProxy<IUserGateway>;
  let authTokenGateway: MockProxy<IAuthTokenGateway>;
  let userUseCase: UserUseCase;

  beforeEach(() => {
    userGateway = mock<IUserGateway>();
    authTokenGateway = mock<IAuthTokenGateway>();

    container.clearInstances();
    container.registerInstance('UserGateway', userGateway);
    container.registerInstance('AuthTokenGateway', authTokenGateway);

    userUseCase = container.resolve(UserUseCase);
  });

  describe('create', () => {
    it('should create a new user and return the user ID', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const userId = 'user-id';

      userGateway.create.mockResolvedValue(userId);

      const result = await userUseCase.create({ email, password });

      expect(userGateway.create).toHaveBeenCalledWith(
        new Email(email).getValue(),
        'hashed-password'
      );
      expect(result).toBe(userId);
    });
  });

  describe('login', () => {
    it('should login a user and return an auth token', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const user = { id: 'user-id', email, password: 'hashed-password' };
      const authToken = 'auth-token';

      userGateway.findOne.mockResolvedValue(user);
      authTokenGateway.generateToken.mockReturnValue(authToken);

      const result = await userUseCase.login({ email, password });

      expect(userGateway.findOne).toHaveBeenCalledWith(email);
      expect(authTokenGateway.generateToken).toHaveBeenCalledWith({
        id: user.id,
        email: user.email,
      });
      expect(result).toBe(authToken);
    });

    it('should throw an error if the email is invalid', async () => {
      const email = 'invalid@example.com';
      const password = 'password123';

      userGateway.findOne.mockResolvedValue(null);

      await expect(userUseCase.login({ email, password })).rejects.toThrow(
        'Invalid email or password'
      );
    });

    it('should throw an error if the password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'invalid-password';
      const user = { id: 'user-id', email, password: 'hashed-password' };

      userGateway.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(userUseCase.login({ email, password })).rejects.toThrow(
        'Invalid email or password'
      );
    });
  });
});
