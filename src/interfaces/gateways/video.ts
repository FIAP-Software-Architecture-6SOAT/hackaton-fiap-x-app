import type { Video } from '@/domain/entities';

export interface IVideoGateway {
  create: (
    fileName: string,
    videoPath: object,
    status: string,
    user: string
  ) => Promise<string>;
  findOne: (id: string) => Promise<Video | null>;
  find: ({ user }: { user: string }) => Promise<Video[]>;
}
