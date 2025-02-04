/* eslint-disable @typescript-eslint/init-declarations */
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';

import { VideoGateway } from '@/adapters/gateways/video';
import { Video } from '@/domain/entities/video';
import type { DbConnection } from '@/domain/interfaces/db/connection';

describe('VideoGateway', () => {
  let dbConnection: MockProxy<DbConnection>;
  let videoGateway: VideoGateway;

  beforeEach(() => {
    dbConnection = mock<DbConnection>();
    videoGateway = new VideoGateway(dbConnection);
  });

  describe('create', () => {
    it('should create a new video and return the video ID', async () => {
      const fileName = 'video.mp4';
      const videoPath = { key: 'video-key', bucket: 'video-bucket' };
      const status = 'Processando';
      const user = 'user-id';
      const videoId = 'video-id';

      dbConnection.create.mockResolvedValue({ _id: videoId });

      const result = await videoGateway.create(fileName, videoPath, status, user);

      expect(dbConnection.create).toHaveBeenCalledWith({ fileName, videoPath, status, user });
      expect(result).toBe(videoId);
    });
  });

  describe('findOne', () => {
    it('should find a video by ID and return the video', async () => {
      const video = new Video(
        'video-id',
        'video.mp4',
        { key: 'video-key', bucket: 'video-bucket' },
        { key: 'images-key', bucket: 'images-bucket' },
        'Processed',
        'user-id'
      );

      dbConnection.findOne.mockResolvedValue(video);

      const result = await videoGateway.findOne('video-id');

      expect(dbConnection.findOne).toHaveBeenCalledWith({ _id: 'video-id' });
      expect(result).toEqual(video);
    });

    it('should return null if the video is not found', async () => {
      dbConnection.findOne.mockResolvedValue(null);

      const result = await videoGateway.findOne('video-id');

      expect(dbConnection.findOne).toHaveBeenCalledWith({ _id: 'video-id' });
      expect(result).toBeNull();
    });
  });

  describe('find', () => {
    it('should find videos by user ID and return the videos', async () => {
      const videos = [
        new Video(
          'video-id',
          'video.mp4',
          { key: 'video-key', bucket: 'video-bucket' },
          { key: 'images-key', bucket: 'images-bucket' },
          'Processed',
          'user-id'
        ),
      ];

      dbConnection.find.mockResolvedValue(videos);

      const result = await videoGateway.find({ user: 'user-id' });

      expect(dbConnection.find).toHaveBeenCalledWith({ user: 'user-id' });
      expect(result).toEqual(videos);
    });
  });
});
