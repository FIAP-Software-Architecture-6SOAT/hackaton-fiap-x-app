/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { VideoUseCase } from '@/application/usecases';
import type { HttpRequest, HttpResponse } from '@/interfaces/http';

export class VideoController {
  public constructor(private readonly videoUseCase: VideoUseCase) {}

  public async upload(request: HttpRequest): Promise<HttpResponse> {
    try {
      const { user } = request.state;

      const file = await request.file();

      if (!file) {
        return {
          data: {
            err: 'File is required',
          },
          statusCode: 400,
        };
      }

      const videoId = await this.videoUseCase.upload({
        file,
        user,
      });

      return {
        data: {
          id: videoId,
        },
        statusCode: 201,
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
