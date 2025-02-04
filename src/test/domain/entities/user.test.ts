/* eslint-disable @typescript-eslint/init-declarations */
import { User } from '@/domain/entities/user';

describe('User', () => {
  let user: User;
  const id = 'user-id';
  const email = 'test@example.com';
  const password = 'password123';

  beforeEach(() => {
    user = new User(id, email, password);
  });

  it('should create a user with the given id, email, and password', () => {
    expect(user.id).toBe(id);
    expect(user.email).toBe(email);
    expect(user.password).toBe(password);
  });

  it('should return the user id', () => {
    expect(user.id).toBe(id);
  });

  it('should return the user email', () => {
    expect(user.email).toBe(email);
  });

  it('should return the user password', () => {
    expect(user.password).toBe(password);
  });
});
