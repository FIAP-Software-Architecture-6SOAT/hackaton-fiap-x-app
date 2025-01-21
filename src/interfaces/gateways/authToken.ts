export interface IAuthTokenGateway {
  authenticate: (token: string) => false | { id: string; email: string };
}
