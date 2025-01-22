/* eslint-disable no-process-env */
import { randomUUID } from 'crypto';

import type {
  CloudStorageGateway,
  QueueGateway,
  VideoGateway,
} from '@/adapters/gateways';
import type { UploadedFile } from '@/types';

export class VideoUseCase {
  public constructor(
    private readonly videoGateway: VideoGateway,
    private readonly cloudStorageGateway: CloudStorageGateway,
    private readonly queueGateway: QueueGateway
  ) {}

  public async upload({
    file,
    user,
  }: {
    file: UploadedFile;
    user: { id: string; email: string };
  }): Promise<{ id: string; fileName: string; status: string }> {
    const fileBuffer = await file.toBuffer();
    const formattedFilename = file.filename.replace(/\s/g, '_');
    const fileName = `${randomUUID()}_${formattedFilename}`;
    const BUCKET = 'processvideos';

    const input = {
      bucket: BUCKET,
      key: fileName,
      fileBuffer,
      contentType: file.mimetype,
    };

    await this.cloudStorageGateway.upload(input);

    const videoId = await this.videoGateway.create(
      file.filename,
      { key: fileName, bucket: BUCKET },
      'Processando',
      user.id
    );

    await this.queueGateway.sendMessage(
      process.env.QUEUE_URL as string,
      JSON.stringify({ key: fileName, videoId })
    );

    return { id: videoId, fileName: file.filename, status: 'Processando' };
  }
}
