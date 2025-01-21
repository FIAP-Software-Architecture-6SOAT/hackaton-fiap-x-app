import { VideoModel } from '../models';
import { MongoDbConnection } from './db-connections';

export class VideoDbConnection extends MongoDbConnection {
  public constructor() {
    super(VideoModel);
  }
}
