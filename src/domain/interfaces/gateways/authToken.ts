export interface IAuthTokenGateway {
  authenticate: (token: string) => false | { id: string; email: string };
  generateToken: (payload: { id: string; email: string }) => string;
}
