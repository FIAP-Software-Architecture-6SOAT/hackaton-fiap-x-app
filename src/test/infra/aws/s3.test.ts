/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable @typescript-eslint/init-declarations */
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { S3 } from '@/infra/aws/s3';

jest.mock('@aws-sdk/client-s3');
jest.mock('@aws-sdk/s3-request-presigner');

describe('S3', () => {
  let s3: S3;
  let mockSend: jest.Mock;
  let mockGetSignedUrl: jest.Mock;
  let s3ClientInstance: S3Client;

  beforeEach(() => {
    mockSend = jest.fn();
    mockGetSignedUrl = jest.fn();
    s3ClientInstance = new S3Client({});
    (S3Client as jest.Mock).mockImplementation(() => s3ClientInstance);
    (getSignedUrl as jest.Mock).mockImplementation(mockGetSignedUrl);
    s3 = new S3();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should upload a file to the S3 bucket', async () => {
    const bucket = 'test-bucket';
    const key = 'test-key';
    const fileBuffer = Buffer.from('test-file');
    const contentType = 'text/plain';
    mockSend.mockResolvedValueOnce({});
    await s3.upload({ bucket, key, fileBuffer, contentType });

    expect(s3ClientInstance.send).toHaveBeenCalledTimes(1);
    expect(s3ClientInstance.send).toHaveBeenCalledWith(expect.any(PutObjectCommand));
  });

  it('should get a download URL for a file in the S3 bucket', async () => {
    const bucket = 'test-bucket';
    const key = 'test-key';
    const url = 'https://example.com/test-url';
    mockGetSignedUrl.mockResolvedValueOnce(url);
    const result = await s3.getDownloadUrl({ bucket, key });

    expect(mockGetSignedUrl).toHaveBeenCalledTimes(1);
    expect(mockGetSignedUrl).toHaveBeenCalledWith(s3ClientInstance, expect.any(GetObjectCommand), {
      expiresIn: 3600,
    });
    expect(result).toBe(url);
  });
});
