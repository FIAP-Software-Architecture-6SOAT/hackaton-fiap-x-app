/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/init-declarations */

import { S3Gateway } from '@/adapters/gateways';
import { S3 } from '@/infra/aws';

jest.mock('@/infra/aws', () => ({
  S3: jest.fn().mockImplementation(() => ({
    upload: jest.fn(),
    getDownloadUrl: jest.fn(),
  })),
}));

describe('S3Gateway', () => {
  let s3Gateway: S3Gateway;
  let s3: jest.Mocked<S3>;

  beforeEach(() => {
    s3 = new S3() as jest.Mocked<S3>;
    s3Gateway = new S3Gateway();
    (s3Gateway as any).s3 = s3;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('upload', () => {
    it('should upload a file to S3 and return the file URL', async () => {
      const params = {
        bucket: 'test-bucket',
        key: 'test-key',
        fileBuffer: Buffer.from('file-content'),
        contentType: 'video/mp4',
      };

      s3.upload.mockResolvedValue();
      await s3Gateway.upload(params);

      expect(s3.upload).toHaveBeenCalledWith(params);
    });
  });

  describe('getDownloadUrl', () => {
    it('should return a signed URL for the given file', async () => {
      const params = { key: 'test-key', bucket: 'test-bucket' };
      const signedUrl = 'signed-url';

      s3.getDownloadUrl.mockResolvedValue(signedUrl);

      const result = await s3Gateway.getDownloadUrl(params);

      expect(s3.getDownloadUrl).toHaveBeenCalledWith(params);
      expect(result).toBe(signedUrl);
    });
  });
});
