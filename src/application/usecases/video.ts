/* eslint-disable no-process-env */
import 'reflect-metadata';

import { randomUUID } from 'crypto';
import { inject, injectable } from 'tsyringe';

import type { Video } from '@/domain/entities';
import { ICloudStorageGateway, IQueueGateway, IVideoGateway } from '@/interfaces/gateways';
import type { UploadedFile } from '@/interfaces/upload';

@injectable()
export class VideoUseCase {
  public constructor(
    @inject('VideoGateway') private readonly videoGateway: IVideoGateway,
    @inject('CloudStorageGateway') private readonly cloudStorageGateway: ICloudStorageGateway,
    @inject('QueueGateway') private readonly queueGateway: IQueueGateway
  ) {}

  public async getVideo({
    id,
    user,
  }: {
    id: string;
    user: { id: string; email: string };
  }): Promise<Video | null> {
    const video = await this.videoGateway.findOne(id);
    if (!video) throw new Error('Video not found');
    if (video.user.toString() !== user.id) return null;
    return video;
  }

  public async getVideos(user: { id: string; email: string }): Promise<Video[]> {
    const videos = await this.videoGateway.find({ user: user.id });
    return videos;
  }

  public async upload({
    file,
    user,
  }: {
    file: UploadedFile;
    user: { id: string; email: string };
  }): Promise<{ id: string; fileName: string; status: string }> {
    const fileBuffer = await file.toBuffer();
    const formattedFilename = file.filename.replace(/\s/g, '_');
    const key = `${randomUUID()}_${formattedFilename}`;
    const BUCKET = 'processvideos';

    const input = {
      bucket: BUCKET,
      key,
      fileBuffer,
      contentType: file.mimetype,
    };

    await this.cloudStorageGateway.upload(input);

    const videoId = await this.videoGateway.create(
      file.filename,
      { key, bucket: BUCKET },
      'Processando',
      user.id
    );

    await this.queueGateway.sendMessage(
      process.env.QUEUE_URL as string,
      JSON.stringify({ videoId })
    );

    return { id: videoId, fileName: file.filename, status: 'Processando' };
  }

  public async downloadImages(id: string): Promise<{ message: string; link: string | null }> {
    const video = await this.videoGateway.findOne(id);
    if (!video) throw new Error('Video not found');

    if (video.status === 'Processando') {
      return { message: 'video is still processing', link: null };
    }

    if (video.status === 'Erro') {
      return {
        message: 'Video processing failed, images are not available',
        link: null,
      };
    }

    const url = await this.cloudStorageGateway.getDownloadUrl({
      key: video.imagesZipPath.key,
      bucket: video.imagesZipPath.bucket,
    });

    return { message: 'Images ready to download', link: url };
  }
}
