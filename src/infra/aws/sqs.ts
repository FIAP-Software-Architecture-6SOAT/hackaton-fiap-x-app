/* eslint-disable no-process-env */
import { SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

export class SQS {
  private readonly client: SQSClient;

  public constructor() {
    this.client = new SQSClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        sessionToken: process.env.AWS_SESSION_TOKEN as string,
      },
    });
  }

  public async sendMessage(queueUrl: string, message: string): Promise<void> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: message,
    });

    await this.client.send(command);
  }
}
