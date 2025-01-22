import { SQS } from '@/infra/aws';
import type { IQueueGateway } from '@/interfaces/gateways';

export class SQSGateway implements IQueueGateway {
  private readonly sqs: SQS;

  public constructor() {
    this.sqs = new SQS();
  }

  public async sendMessage(queueUrl: string, message: string): Promise<void> {
    await this.sqs.sendMessage(queueUrl, message);
  }
}
