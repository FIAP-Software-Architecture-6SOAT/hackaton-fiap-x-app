import { S3 } from '@/infra/aws';
import type { ICloudStorageGateway } from '@/interfaces/gateways';

export class S3Gateway implements ICloudStorageGateway {
  private readonly s3: S3;

  public constructor() {
    this.s3 = new S3();
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
    await this.s3.upload({
      bucket,
      key,
      fileBuffer,
      contentType,
    });
  }
}
