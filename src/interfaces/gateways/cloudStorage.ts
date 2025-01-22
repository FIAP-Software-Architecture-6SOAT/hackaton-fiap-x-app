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

  getDownloadUrl: ({
    bucket,
    key,
  }: {
    bucket: string;
    key: string;
  }) => Promise<string>;
}
