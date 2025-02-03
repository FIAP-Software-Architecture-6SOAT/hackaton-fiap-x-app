/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import type { MockProxy } from 'jest-mock-extended';
import { mock } from 'jest-mock-extended';

import { VideoController } from '@/adapters/controllers';
import type { VideoUseCase } from '@/application/usecases';
import type { Video } from '@/domain/entities';
import type { HttpRequest } from '@/domain/interfaces/http';

describe('VideoController', () => {
  let videoUseCase: MockProxy<VideoUseCase>;
  let videoController: VideoController;

  beforeEach(() => {
    videoUseCase = mock<VideoUseCase>();
    videoController = new VideoController(videoUseCase);
  });

  describe('getVideo', () => {
    it('should return 200 and the video if found', async () => {
      const request = {
        params: { id: 'video-id' },
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as HttpRequest;
      const video = {
        fileName: 'video.mp4',
        status: 'Processed',
        imagesZipPath: {},
        videoPath: {},
      } as unknown as Video;

      videoUseCase.getVideo.mockResolvedValue(video);

      const response = await videoController.getVideo(request);

      expect(videoUseCase.getVideo).toHaveBeenCalledWith({
        id: 'video-id',
        user: { id: 'user-id', email: 'test@example.com' },
      });
      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual(video);
    });

    it('should return 400 if the video ID is not provided', async () => {
      const request = {
        params: {},
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as unknown as HttpRequest;

      const response = await videoController.getVideo(request);

      expect(videoUseCase.getVideo).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'Id is required' });
    });

    it('should return 500 if the video is not found', async () => {
      const request = {
        params: { id: 'video-id' },
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as HttpRequest;

      videoUseCase.getVideo.mockRejectedValue(new Error('Video not found'));

      const response = await videoController.getVideo(request);

      expect(videoUseCase.getVideo).toHaveBeenCalledWith({
        id: 'video-id',
        user: { id: 'user-id', email: 'test@example.com' },
      });
      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Video not found' });
    });
  });

  describe('getVideos', () => {
    it('should return 200 and the list of videos', async () => {
      const request = {
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as HttpRequest;
      const videos = [
        { id: 'video-id', fileName: 'video.mp4', status: 'Processed' },
      ] as unknown as Video[];

      videoUseCase.getVideos.mockResolvedValue(videos);

      const response = await videoController.getVideos(request);

      expect(videoUseCase.getVideos).toHaveBeenCalledWith({
        id: 'user-id',
        email: 'test@example.com',
      });
      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual(videos);
    });

    it('should return 500 if there any errors', async () => {
      const request = {
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as HttpRequest;

      videoUseCase.getVideos.mockRejectedValue(new Error('Error getting videos'));

      const response = await videoController.getVideos(request);

      expect(videoUseCase.getVideos).toHaveBeenCalledWith({
        id: 'user-id',
        email: 'test@example.com',
      });
      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Error getting videos' });
    });
  });

  describe('upload', () => {
    it('should return 201 and the video details if upload is successful', async () => {
      const file = {
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('file-content')),
        filename: 'video.mp4',
        mimetype: 'video/mp4',
      };
      const request = {
        file: jest.fn().mockResolvedValue(file),
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as unknown as HttpRequest;
      const videoDetails = { id: 'video-id', fileName: 'video.mp4', status: 'Processando' };

      videoUseCase.upload.mockResolvedValue(videoDetails);

      const response = await videoController.upload(request);

      expect(videoUseCase.upload).toHaveBeenCalledWith({
        file,
        user: { id: 'user-id', email: 'test@example.com' },
      });
      expect(response.statusCode).toBe(201);
      expect(response.data).toEqual(videoDetails);
    });

    it('should return 400 if the file is not provided', async () => {
      const request = {
        file: jest.fn().mockResolvedValue(null),
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as unknown as HttpRequest;

      const response = await videoController.upload(request);

      expect(videoUseCase.upload).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'File is required' });
    });

    it('should return 500 if upload fails', async () => {
      const file = {
        toBuffer: jest.fn().mockResolvedValue(Buffer.from('file-content')),
        filename: 'video.mp4',
        mimetype: 'video/mp4',
      };
      const request = {
        file: jest.fn().mockResolvedValue(file),
        state: { user: { id: 'user-id', email: 'test@example.com' } },
      } as unknown as HttpRequest;

      videoUseCase.upload.mockRejectedValue(new Error('Upload failed'));

      const response = await videoController.upload(request);

      expect(videoUseCase.upload).toHaveBeenCalledWith({
        file,
        user: { id: 'user-id', email: 'test@example.com' },
      });
      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Upload failed' });
    });
  });

  describe('downloadImages', () => {
    it('should return 200 and the download link if images are ready', async () => {
      const request = { params: { id: 'video-id' } } as HttpRequest;
      const downloadLink = { message: 'Images ready to download', link: 'download-url' };

      videoUseCase.downloadImages.mockResolvedValue(downloadLink);

      const response = await videoController.downloadImages(request);

      expect(videoUseCase.downloadImages).toHaveBeenCalledWith('video-id');
      expect(response.statusCode).toBe(200);
      expect(response.data).toEqual(downloadLink);
    });

    it('should return 400 if the video ID is not provided', async () => {
      const request = { params: {} } as HttpRequest;

      const response = await videoController.downloadImages(request);

      expect(videoUseCase.downloadImages).not.toHaveBeenCalled();
      expect(response.statusCode).toBe(400);
      expect(response.data).toEqual({ err: 'Id is required' });
    });

    it('should return 500 if the video is not found', async () => {
      const request = { params: { id: 'video-id' } } as HttpRequest;

      videoUseCase.downloadImages.mockRejectedValue(new Error('Video not found'));

      const response = await videoController.downloadImages(request);

      expect(videoUseCase.downloadImages).toHaveBeenCalledWith('video-id');
      expect(response.statusCode).toBe(500);
      expect(response.data).toEqual({ err: 'Video not found' });
    });
  });
});
