import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';

import type { UploadedFile } from '@/types';

export class VideoUseCase {
  private readonly s3Client: S3Client;

  constructor() {
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
    user: object;
  }): Promise<string> {
    // Read the file content
    const fileBuffer = await file.toBuffer();
    console.log('File content length:', fileBuffer.length);

    const formattedFilename = file.filename.replace(/ /g, '_');
    const fileName = `${randomUUID()}_${formattedFilename}`;

    // Define S3 upload parameters
    const params = {
      Bucket: 'processvideos',
      Key: `${fileName}`,
      Body: fileBuffer,
      ContentType: file.mimetype,
    };

    // Upload file to S3
    const command = new PutObjectCommand(params);
    const uploadResult = await this.s3Client.send(command);
    console.log('🚀 ~ VideoUseCase ~ uploadResult:', uploadResult);

    return fileName;
  }
}
