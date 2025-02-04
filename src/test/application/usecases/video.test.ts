/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/init-declarations */
import 'reflect-metadata';

import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';
import { container } from 'tsyringe';

import { VideoUseCase } from '@/application/usecases/video';
import type { Video } from '@/domain/entities';
import type {
  ICloudStorageGateway,
  IQueueGateway,
  IVideoGateway,
} from '@/domain/interfaces/gateways';
import type { UploadedFile } from '@/domain/interfaces/upload';

describe('VideoUseCase', () => {
  let videoGateway: MockProxy<IVideoGateway>;
  let cloudStorageGateway: MockProxy<ICloudStorageGateway>;
  let queueGateway: MockProxy<IQueueGateway>;
  let videoUseCase: VideoUseCase;

  beforeEach(() => {
    process.env.BUCKET_VIDEOS_NAME = 'test-bucket';
    process.env.QUEUE_URL = 'test-queue-url';

    videoGateway = mock<IVideoGateway>();
    cloudStorageGateway = mock<ICloudStorageGateway>();
    queueGateway = mock<IQueueGateway>();

    container.clearInstances();
    container.registerInstance('VideoGateway', videoGateway);
    container.registerInstance('CloudStorageGateway', cloudStorageGateway);
    container.registerInstance('QueueGateway', queueGateway);

    videoUseCase = container.resolve(VideoUseCase);
  });

  describe('getVideo', () => {
    it('should return a video if it belongs to the user', async () => {
      const video = { id: 'video-id', user: 'user-id' } as Video;
      videoGateway.findOne.mockResolvedValue(video);

      const result = await videoUseCase.getVideo({
        id: 'video-id',
        user: { id: 'user-id', email: 'test@example.com' },
      });

      expect(videoGateway.findOne).toHaveBeenCalledWith('video-id');
      expect(result).toEqual(video);
    });

    it('should return null if the video does not belong to the user', async () => {
      const video = { id: 'video-id', user: 'other-user-id' } as Video;
      videoGateway.findOne.mockResolvedValue(video);

      const result = await videoUseCase.getVideo({
        id: 'video-id',
        user: { id: 'user-id', email: 'test@example.com' },
      });

      expect(videoGateway.findOne).toHaveBeenCalledWith('video-id');
      expect(result).toBeNull();
    });

    it('should throw an error if the video is not found', async () => {
      videoGateway.findOne.mockResolvedValue(null);

      await expect(
        videoUseCase.getVideo({
          id: 'video-id',
          user: { id: 'user-id', email: 'test@example.com' },
        })
      ).rejects.toThrow('Video not found');
    });
  });

  describe('getVideos', () => {
    it('should return a list of videos belonging to the user', async () => {
      const videos = [{ id: 'video-id', user: 'user-id' }] as Video[];
      videoGateway.find.mockResolvedValue(videos);

      const result = await videoUseCase.getVideos({ id: 'user-id', email: 'test@example.com' });

      expect(videoGateway.find).toHaveBeenCalledWith({ user: 'user-id' });
      expect(result).toEqual(videos);
    });
  });

  describe('upload', () => {
    it('should upload a video and return the video details', async () => {
      const file: MockProxy<UploadedFile> = mock<UploadedFile>();
      file.toBuffer.mockResolvedValue(Buffer.from('file-content'));
      file.filename = 'video.mp4';
      file.mimetype = 'video/mp4';

      const user = { id: 'user-id', email: 'test@example.com' };
      const videoId = 'video-id';

      videoGateway.create.mockResolvedValue(videoId);

      const result = await videoUseCase.upload({ file, user });

      expect(cloudStorageGateway.upload).toHaveBeenCalledWith({
        bucket: 'test-bucket',
        key: expect.any(String) as string,
        fileBuffer: Buffer.from('file-content'),
        contentType: 'video/mp4',
      });
      expect(videoGateway.create).toHaveBeenCalledWith(
        'video.mp4',
        expect.any(Object),
        'Processando',
        'user-id'
      );
      expect(queueGateway.sendMessage).toHaveBeenCalledWith(
        'test-queue-url',
        JSON.stringify({ videoId })
      );
      expect(result).toEqual({ id: videoId, fileName: 'video.mp4', status: 'Processando' });
    });
  });

  describe('downloadImages', () => {
    it('should return a download link if the video is processed', async () => {
      const video = {
        id: 'video-id',
        status: 'Processed',
        imagesZipPath: { key: 'images.zip', bucket: 'bucket' },
      } as Video;
      videoGateway.findOne.mockResolvedValue(video);
      cloudStorageGateway.getDownloadUrl.mockResolvedValue('download-url');

      const result = await videoUseCase.downloadImages('video-id');

      expect(videoGateway.findOne).toHaveBeenCalledWith('video-id');
      expect(cloudStorageGateway.getDownloadUrl).toHaveBeenCalledWith({
        key: 'images.zip',
        bucket: 'bucket',
      });
      expect(result).toEqual({ message: 'Images ready to download', link: 'download-url' });
    });

    it('should return a processing message if the video is still processing', async () => {
      const video = { id: 'video-id', status: 'Processando' } as Video;
      videoGateway.findOne.mockResolvedValue(video);

      const result = await videoUseCase.downloadImages('video-id');

      expect(videoGateway.findOne).toHaveBeenCalledWith('video-id');
      expect(result).toEqual({ message: 'video is still processing', link: null });
    });

    it('should return an error message if the video processing failed', async () => {
      const video = { id: 'video-id', status: 'Erro' } as Video;
      videoGateway.findOne.mockResolvedValue(video);

      const result = await videoUseCase.downloadImages('video-id');

      expect(videoGateway.findOne).toHaveBeenCalledWith('video-id');
      expect(result).toEqual({
        message: 'Video processing failed, images are not available',
        link: null,
      });
    });

    it('should throw an error if the video is not found', async () => {
      videoGateway.findOne.mockResolvedValue(null);

      await expect(videoUseCase.downloadImages('video-id')).rejects.toThrow('Video not found');
    });
  });
});
