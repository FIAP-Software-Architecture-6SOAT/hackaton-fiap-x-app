import type { UploadedFile } from '@/types';

export interface HttpRequest<T = any> {
  body: {
    email: string;
    password: string;
  };
  headers: T;
  params: {
    id: string;
  };
  query: T;
  state: {
    user: {
      id: string;
      email: string;
    };
  };
  file: (input: object) => Promise<UploadedFile>;
}
