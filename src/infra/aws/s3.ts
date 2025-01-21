/* eslint-disable no-process-env */
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';

export class S3 {
  private readonly client: S3Client;

  public constructor() {
    this.client = new S3Client({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        sessionToken: process.env.AWS_SESSION_TOKEN as string,
      },
    });
  }

  public async upload({
    bucket,
    key,
    fileBuffer,
    contentType,
  }: {
    bucket: string;
    key: string;
    fileBuffer: Buffer;
    contentType: string;
  }): Promise<void> {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
    };

    const command = new PutObjectCommand(params);
    await this.client.send(command);
  }
}
