/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { VideoUseCase } from '@/application/usecases';
import type { HttpRequest, HttpResponse } from '@/interfaces/http';

@injectable()
export class VideoController {
  public constructor(@inject('VideoUseCase') private readonly videoUseCase: VideoUseCase) {}

  public async getVideo(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = request.state;
      const { id } = request.params;

      if (!id) {
        return {
          data: {
            err: 'Id is required',
          },
          statusCode: 400,
        };
      }

      const video = await this.videoUseCase.getVideo({
        id,
        user,
      });

      return {
        data: {
          fileName: video?.fileName,
          status: video?.status,
          videoPath: video?.videoPath,
          imagesZipPath: video?.imagesZipPath,
        },
        statusCode: 200,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }

  public async getVideos(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = request.state;

      const videos = await this.videoUseCase.getVideos(user);

      return {
        data: videos.map((video) => ({
          id: video.id,
          fileName: video.fileName,
          status: video.status,
          videoPath: video.videoPath,
          imagesZipPath: video?.imagesZipPath,
        })),
        statusCode: 200,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }

  public async upload(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = request.state;
      const file = await request.file({ limits: { fileSize: 104857600 } }); // 100MB 104857600

      if (!file) {
        return {
          data: {
            err: 'File is required',
          },
          statusCode: 400,
        };
      }

      const video = await this.videoUseCase.upload({
        file,
        user,
      });

      return {
        data: video,
        statusCode: 201,
      };
    } catch (err: unknown) {
      const messageError = err instanceof Error ? err.message : 'Unknown error';
      const response = {
        data: {
          err:
            (err as { code?: string }).code === 'FST_REQ_FILE_TOO_LARGE'
              ? 'Limit file size is 100MB'
              : messageError,
        },
        statusCode: 500,
      };
      return response;
    }
  }

  public async downloadImages(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { id } = request.params;

      if (!id) {
        return {
          data: {
            err: 'Id is required',
          },
          statusCode: 400,
        };
      }

      const link = await this.videoUseCase.downloadImages(id);

      return {
        data: link,
        statusCode: 200,
      };
    } catch (err: unknown) {
      return {
        data: {
          err: err instanceof Error ? err.message : 'Unknown error',
        },
        statusCode: 500,
      };
    }
  }
}
