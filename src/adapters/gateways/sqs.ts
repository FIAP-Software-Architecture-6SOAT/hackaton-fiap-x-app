import 'reflect-metadata';

import { injectable } from 'tsyringe';

import type { IQueueGateway } from '@/domain/interfaces/gateways';
import { SQS } from '@/infra/aws';

@injectable()
export class SQSGateway implements IQueueGateway {
  private readonly sqs: SQS;

  public constructor() {
    this.sqs = new SQS();
  }

  public async sendMessage(queueUrl: string, message: string): Promise<void> {
    await this.sqs.sendMessage(queueUrl, message);
  }
}
