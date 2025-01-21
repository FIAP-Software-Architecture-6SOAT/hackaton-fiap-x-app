/* eslint-disable no-process-env */
import type { SignUpCommandOutput } from '@aws-sdk/client-cognito-identity-provider';
import {
  AdminGetUserCommand,
  CognitoIdentityProviderClient,
  SignUpCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

import { SecretsManager } from './secretsManager';

dotenv.config();

export class Cognito {
  private readonly client: CognitoIdentityProviderClient;

  private readonly secretsManager: SecretsManager;

  public constructor() {
    this.client = new CognitoIdentityProviderClient({
      region: 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
        sessionToken: process.env.AWS_SESSION_TOKEN as string,
      },
    });
    this.secretsManager = new SecretsManager();
  }

  public async adminGetUser(username: string): Promise<object> {
    const COGNITO_USER_POOL_ID = await this.secretsManager.getSecretValue(
      'COGNITO_USER_POOL_ID'
    );
    const command = new AdminGetUserCommand({
      UserPoolId: COGNITO_USER_POOL_ID,
      Username: username,
    });

    return this.client.send(command);
  }

  public async signUp({
    username,
    name,
    email,
  }: {
    username: string;
    name?: string;
    email?: string;
  }): Promise<SignUpCommandOutput> {
    const COGNITO_CLIENT_ID = await this.secretsManager.getSecretValue(
      'COGNITO_CLIENT_ID'
    );
    const UserAttributes = [];
    if (name) {
      UserAttributes.push({ Name: 'name', Value: name });
    }
    if (email) {
      UserAttributes.push({ Name: 'email', Value: email });
    }

    const command = new SignUpCommand({
      ClientId: COGNITO_CLIENT_ID,
      Username: username,
      Password: randomUUID(),
      UserAttributes,
    });

    return this.client.send(command);
  }
}
