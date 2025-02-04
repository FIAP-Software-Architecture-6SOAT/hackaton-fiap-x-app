/* eslint-disable @typescript-eslint/init-declarations */
import { Video } from '@/domain/entities/video';

describe('Video', () => {
  let video: Video;
  const id = 'video-id';
  const fileName = 'video.mp4';
  const videoPath = { key: 'video-key', bucket: 'video-bucket' };
  const imagesZipPath = { key: 'images-key', bucket: 'images-bucket' };
  const status = 'Processed';
  const user = 'user-id';

  beforeEach(() => {
    video = new Video(id, fileName, videoPath, imagesZipPath, status, user);
  });

  it('should create a video with the given properties', () => {
    expect(video.id).toBe(id);
    expect(video.fileName).toBe(fileName);
    expect(video.videoPath).toBe(videoPath);
    expect(video.imagesZipPath).toBe(imagesZipPath);
    expect(video.status).toBe(status);
    expect(video.user).toBe(user);
  });

  it('should return the video id', () => {
    expect(video.id).toBe(id);
  });

  it('should return the video fileName', () => {
    expect(video.fileName).toBe(fileName);
  });

  it('should return the video videoPath', () => {
    expect(video.videoPath).toBe(videoPath);
  });

  it('should return the video imagesZipPath', () => {
    expect(video.imagesZipPath).toBe(imagesZipPath);
  });

  it('should return the video status', () => {
    expect(video.status).toBe(status);
  });

  it('should return the video user', () => {
    expect(video.user).toBe(user);
  });
});
