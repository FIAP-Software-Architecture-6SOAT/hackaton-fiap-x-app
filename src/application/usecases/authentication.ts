import 'reflect-metadata';

import { inject, injectable } from 'tsyringe';

import { IAuthTokenGateway } from '@/domain/interfaces/gateways';

@injectable()
export class AuthenticationUseCase {
  public constructor(
    @inject('AuthTokenGateway') private readonly authTokenGateway: IAuthTokenGateway
  ) {}

  public authenticate(token: string): false | { id: string; email: string } {
    return this.authTokenGateway.authenticate(token);
  }
}
