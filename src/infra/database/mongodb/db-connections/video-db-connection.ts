import 'reflect-metadata';

import { injectable } from 'tsyringe';

import { VideoModel } from '../models';
import { MongoDbConnection } from './db-connections';

@injectable()
export class VideoDbConnection extends MongoDbConnection {
  public constructor() {
    super(VideoModel);
  }
}
