import type { IAuthTokenGateway } from '@/interfaces/gateways';

export class AuthenticationUseCase {
  public constructor(private readonly authTokenGateway: IAuthTokenGateway) {}

  public authenticate(token: string): false | { id: string; email: string } {
    return this.authTokenGateway.authenticate(token);
  }
}
