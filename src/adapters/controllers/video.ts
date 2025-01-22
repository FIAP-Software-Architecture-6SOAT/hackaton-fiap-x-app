/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { VideoUseCase } from '@/application/usecases';
import type { HttpRequest, HttpResponse } from '@/interfaces/http';

export class VideoController {
  public constructor(private readonly videoUseCase: VideoUseCase) {}

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
        data: { link },
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
