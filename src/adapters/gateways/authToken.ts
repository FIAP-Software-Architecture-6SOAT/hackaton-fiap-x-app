/* eslint-disable no-underscore-dangle */
import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { AuthToken } from '@/infra/authToken';
import type { IAuthTokenGateway } from '@/interfaces/gateways';

@injectable()
export class AuthTokenGateway implements IAuthTokenGateway {
  public constructor(@inject('AuthToken') private readonly authToken: AuthToken) {}

  public authenticate(token: string): false | { id: string; email: string } {
    const verify = this.authToken.verifyToken(token);
    if (!verify) return false;

    const payload = this.authToken.getPayload();
    return { id: payload.id as string, email: payload.email as string };
  }

  public generateToken(payload: { id: string; email: string }): string {
    return this.authToken.generateToken(payload);
  }
}
