/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';

import { UserGateway } from '@/adapters/gateways/user';
import { User } from '@/domain/entities/user';
import type { MongoDbConnection } from '@/infra/database/mongodb/db-connections/db-connections';

describe('UserGateway', () => {
  let dbConnection: MockProxy<MongoDbConnection>;
  let userGateway: UserGateway;

  beforeEach(() => {
    dbConnection = mock<MongoDbConnection>();
    userGateway = new UserGateway(dbConnection);
  });

  describe('create', () => {
    it('should create a new user and return the user ID', async () => {
      const email = 'test@example.com';
      const password = 'hashed-password';
      const userId = 'user-id';

      dbConnection.create.mockResolvedValue({ _id: userId });

      const result = await userGateway.create(email, password);

      expect(dbConnection.create).toHaveBeenCalledWith({ email, password });
      expect(result).toBe(userId);
    });
  });

  describe('findOne', () => {
    it('should find a user by email and return the user', async () => {
      const email = 'test@example.com';
      const user = new User('user-id', email, 'hashed-password');

      dbConnection.findOne.mockResolvedValue(user);

      const result = await userGateway.findOne(email);

      expect(dbConnection.findOne).toHaveBeenCalledWith({ email });
      expect(result).toEqual(user);
    });

    it('should return null if the user is not found', async () => {
      const email = 'test@example.com';

      dbConnection.findOne.mockResolvedValue(null);

      const result = await userGateway.findOne(email);

      expect(dbConnection.findOne).toHaveBeenCalledWith({ email });
      expect(result).toBeNull();
    });
  });
});
