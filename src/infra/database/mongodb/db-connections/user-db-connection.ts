import { UserModel } from '../models';
import { MongoDbConnection } from './db-connections';

export class UserDbConnection extends MongoDbConnection {
  public constructor() {
    super(UserModel);
  }
}
