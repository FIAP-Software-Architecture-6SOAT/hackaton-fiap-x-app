export interface IUserGateway {
  create: (email: string, password: string) => Promise<string>;
  findOne: (email: string) => Promise<{ id: string; email: string; password: string } | null>;
}
