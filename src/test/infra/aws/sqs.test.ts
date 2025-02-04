/* eslint-disable @typescript-eslint/init-declarations */
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { SQS } from '@/infra/aws/sqs';

jest.mock('@aws-sdk/client-sqs');

describe('SQS', () => {
  let sqs: SQS;
  let mockSend: jest.Mock;

  beforeEach(() => {
    mockSend = jest.fn();
    (SQSClient as jest.Mock).mockImplementation(() => ({
      send: mockSend,
    }));
    sqs = new SQS();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message to the SQS queue', async () => {
    const queueUrl = 'test-queue-url';
    const message = 'test-message';
    mockSend.mockResolvedValueOnce({});
    await sqs.sendMessage(queueUrl, message);

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(expect.any(SendMessageCommand));
  });
});
