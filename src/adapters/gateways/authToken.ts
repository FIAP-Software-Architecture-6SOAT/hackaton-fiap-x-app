/* eslint-disable no-underscore-dangle */
import type { AuthToken } from '@/infra/authToken';
import type { IAuthTokenGateway } from '@/interfaces/gateways';

export class AuthTokenGateway implements IAuthTokenGateway {
  public constructor(private readonly authToken: AuthToken) {}

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
