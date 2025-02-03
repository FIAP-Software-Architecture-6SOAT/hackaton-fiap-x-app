/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';

import { UserController } from '@/adapters/controllers';
import type { UserUseCase } from '@/application/usecases';
import type { HttpRequest } from '@/domain/interfaces/http';

describe('UserController', () => {
  let userUseCase: MockProxy<UserUseCase>;
  let userController: UserController;

  beforeEach(() => {
    userUseCase = mock<UserUseCase>();
    userController = new UserController(userUseCase);
  });

  describe('login', () => {
    it('should return 200 and the auth token if login is successful', async () => {
      const request = {
        body: { email: 'test@example.com', password: 'password123' },
      } as HttpRequest;
      const authToken = 'auth-token';

      userUseCase.login.mockResolvedValue(authToken);

      const response = await userController.login(request);

      expect(userUseCase.login).toHaveBeenCalledWith(request.body);
      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual({ token: authToken });
    });

    it('should return 500 if login fails', async () => {
      const request = {
        body: { email: 'test@example.com', password: 'wrong-password' },
      } as HttpRequest;

      userUseCase.login.mockRejectedValue(new Error('Invalid email or password'));

      const response = await userController.login(request);

      expect(userUseCase.login).toHaveBeenCalledWith(request.body);
      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Invalid email or password' });
    });

    it('should return 400 if email and password are not provided', async () => {
      const request = { body: {} } as HttpRequest;

      const response = await userController.login(request);

      expect(userUseCase.login).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'Email and password are required' });
    });
  });

  describe('create', () => {
    it('should return 201 and the user ID if user creation is successful', async () => {
      const request = {
        body: { email: 'test@example.com', password: 'password123' },
      } as HttpRequest;
      const userId = 'user-id';

      userUseCase.create.mockResolvedValue(userId);

      const response = await userController.create(request);

      expect(userUseCase.create).toHaveBeenCalledWith(request.body);
      expect(response.statusCode).toBe(201);
      expect(response.data).toEqual({ id: userId });
    });

    it('should return 500 if user creation fails', async () => {
      const request = { body: { email: 'invalid-email', password: 'password123' } } as HttpRequest;

      userUseCase.create.mockRejectedValue(new Error('Invalid email'));

      const response = await userController.create(request);

      expect(userUseCase.create).toHaveBeenCalledWith(request.body);
      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Invalid email' });
    });

    it('should return 400 if email and password are not provided', async () => {
      const request = { body: {} } as HttpRequest;

      const response = await userController.create(request);

      expect(userUseCase.create).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'Email and password are required' });
    });
  });
});
