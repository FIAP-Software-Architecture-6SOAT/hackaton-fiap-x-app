import { SecretsManager } from '@/infra/aws';
import type { ISecretsGateway } from '@/domain/interfaces/gateways';

export class SecretsGateway implements ISecretsGateway {
  private readonly secretsManager: SecretsManager;

  public constructor() {
    this.secretsManager = new SecretsManager();
  }

  public async getSecretValue(secretName: string): Promise<string> {
    return this.secretsManager.getSecretValue(secretName);
  }
}
