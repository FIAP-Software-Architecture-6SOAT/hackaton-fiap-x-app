import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

import type { VideoGateway } from '@/adapters/gateways';
import type { UploadedFile } from '@/types';

export class VideoUseCase {
  private readonly s3Client: S3Client;

  public constructor(private readonly videoGateway: VideoGateway) {
    this.s3Client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
        sessionToken: process.env.AWS_SESSION_TOKEN,
      },
    });
  }

  public async upload({
    file,
    user,
  }: {
    file: UploadedFile;
    user: { id: string; email: string };
  }): Promise<{ id: string; fileName: string; status: string }> {
    // Read the file content
    const fileBuffer = await file.toBuffer();

    const formattedFilename = file.filename.replace(/\s/g, '_');
    const fileName = `${randomUUID()}_${formattedFilename}`;

    // Define S3 upload parameters
    const BUCKET = 'processvideos';
    const params = {
      Bucket: BUCKET,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.mimetype,
    };

    // Upload file to S3
    const command = new PutObjectCommand(params);
    await this.s3Client.send(command);

    const videoId = await this.videoGateway.create(
      file.filename,
      { key: fileName, bucket: BUCKET },
      'Processando',
      user.id
    );

    return { id: videoId, fileName: file.filename, status: 'Processando' };
  }
}
