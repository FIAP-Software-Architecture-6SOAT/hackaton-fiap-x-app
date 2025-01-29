import 'reflect-metadata';

import { injectable } from 'tsyringe';

import { UserModel } from '../models';
import { MongoDbConnection } from './db-connections';

@injectable()
export class UserDbConnection extends MongoDbConnection {
  public constructor() {
    super(UserModel);
  }
}
