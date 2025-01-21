import type { AuthTokenGateway } from '@/adapters/gateways/authToken';

export class AuthenticationUseCase {
  public constructor(private readonly authTokenGateway: AuthTokenGateway) {}

  public authenticate(token: string): false | { id: string; email: string } {
    return this.authTokenGateway.authenticate(token);
  }
}
