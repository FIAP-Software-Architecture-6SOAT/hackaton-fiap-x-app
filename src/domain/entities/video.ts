/* eslint-disable no-underscore-dangle */

export class Video {
  public constructor(
    private readonly _id: string,
    private readonly _fileName: string,
    private readonly _videoPath: { key: string; bucket: string },
    private readonly _imagesZipPath: { key: string; bucket: string },
    private readonly _status: string,
    private readonly _user: string
  ) {}

  public get id(): string {
    return this._id;
  }

  public get fileName(): string {
    return this._fileName;
  }

  public get videoPath(): { key: string; bucket: string } {
    return this._videoPath;
  }

  public get imagesZipPath(): { key: string; bucket: string } {
    return this._imagesZipPath;
  }

  public get status(): string {
    return this._status;
  }

  public get user(): string {
    return this._user;
  }
}
