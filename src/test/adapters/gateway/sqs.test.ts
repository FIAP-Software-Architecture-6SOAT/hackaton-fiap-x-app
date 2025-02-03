/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable no-process-env */
/* eslint-disable @typescript-eslint/init-declarations */

import { SQSGateway } from '@/adapters/gateways';
import { SQS } from '@/infra/aws';

jest.mock('@/infra/aws', () => ({
  SQS: jest.fn().mockImplementation(() => ({
    sendMessage: jest.fn(),
  })),
}));

describe('SQSGateway', () => {
  let sqsGateway: SQSGateway;
  let sqs: jest.Mocked<SQS>;

  beforeEach(() => {
    sqs = new SQS() as jest.Mocked<SQS>;
    sqsGateway = new SQSGateway();
    (sqsGateway as any).sqs = sqs;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendMessage', () => {
    it('should send a message to SQS', async () => {
      const queue = 'test-queue';
      const message = 'test-message';

      sqs.sendMessage.mockResolvedValue();

      await sqsGateway.sendMessage(queue, message);

      expect(sqs.sendMessage).toHaveBeenCalledWith(queue, message);
    });
  });
});
