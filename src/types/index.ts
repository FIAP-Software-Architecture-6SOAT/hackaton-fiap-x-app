export interface UploadedFile {
  filename: string;
  name: string;
  data: Buffer;
  encoding: string;
  mimetype: string;
  size: number;
  toBuffer: () => Promise<Buffer>;
}

export interface UploadResponse {
  message: string;
  file: UploadedFile;
}
