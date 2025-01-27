/* eslint-disable no-underscore-dangle */
import { Video } from '@/domain/entities';
import type { DbConnection } from '@/interfaces/db/connection';
import type { IVideoGateway } from '@/interfaces/gateways';

export class VideoGateway implements IVideoGateway {
  public constructor(private readonly dbConnection: DbConnection) {}

  public async create(
    fileName: string,
    videoPath: object,
    status: string,
    user: string
  ): Promise<string> {
    const video = await this.dbConnection.create<{
      _id: string;
    }>({ fileName, videoPath, status, user });
    return video._id;
  }

  public async findOne(id: string): Promise<Video | null> {
    const video = await this.dbConnection.findOne<Video>({
      _id: id,
    });

    if (!video) return null;
    return new Video(
      video._id,
      video.fileName,
      video.videoPath,
      video.imagesZipPath,
      video.status,
      video.user
    );
  }

  public async find(params: { user: string }): Promise<Video[]> {
    const videos = await this.dbConnection.find<Video>(params);
    return videos.map(
      (video: Video) =>
        new Video(
          video._id,
          video.fileName,
          video.videoPath,
          video.imagesZipPath,
          video.status,
          video.user
        )
    );
  }
}
