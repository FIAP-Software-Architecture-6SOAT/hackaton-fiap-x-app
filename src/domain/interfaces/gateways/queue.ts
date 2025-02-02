export interface IQueueGateway {
  sendMessage: (queueUrl: string, message: string) => Promise<void>;
}
