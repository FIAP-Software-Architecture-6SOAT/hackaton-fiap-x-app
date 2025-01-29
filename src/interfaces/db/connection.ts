export interface DbConnection {
  find: <T = unknown>(params: object) => Promise<T[]>;
  findOne: <T = unknown>(params: object) => Promise<T | null>;
  create: <T = unknown>(params: object) => Promise<T>;
  delete: (id: string) => Promise<void>;
  edit: <T = unknown>(params: { id: string; value: object }) => Promise<T | null>;
}
