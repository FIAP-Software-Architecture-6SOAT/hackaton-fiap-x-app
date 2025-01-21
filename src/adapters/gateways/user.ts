/* eslint-disable no-underscore-dangle */
import { User } from '@/domain/entities';
import type { DbConnection } from '@/interfaces/db/connection';
import type { IUserGateway } from '@/interfaces/gateways';

export class UserGateway implements IUserGateway {
  public constructor(private readonly dbConnection: DbConnection) {}

  public async create(email: string, password: string): Promise<string> {
    const user = await this.dbConnection.create<{
      _id: string;
    }>({ email, password });
    return user._id;
  }

  public async findOne(email: string): Promise<User | null> {
    const user = await this.dbConnection.findOne<{
      _id: string;
      email: string;
      password: string;
    }>({ email });

    if (!user) return null;
    return new User(user._id, user.email, user.password);
  }
}
