export interface IUserGateway {
  create: (email: string, password: string) => Promise<string>;
}
