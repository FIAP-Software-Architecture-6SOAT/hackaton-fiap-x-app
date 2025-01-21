export interface ICloudStorageGateway {
  upload: ({
    bucket,
    key,
    fileBuffer,
    contentType,
  }: {
    bucket: string;
    key: string;
    fileBuffer: Buffer;
    contentType: string;
  }) => Promise<void>;
}
