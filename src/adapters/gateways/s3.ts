import 'reflect-metadata';

import { injectable } from 'tsyringe';

import { S3 } from '@/infra/aws';
import type { ICloudStorageGateway } from '@/domain/interfaces/gateways';

@injectable()
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

  public async getDownloadUrl({ bucket, key }: { bucket: string; key: string }): Promise<string> {
    return this.s3.getDownloadUrl({
      bucket,
      key,
    });
  }
}
