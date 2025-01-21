/* eslint-disable no-underscore-dangle */

export class User {
  public constructor(
    private readonly _id: string,
    private readonly _email: string,
    private readonly _password: string
  ) {}

  public get id(): string {
    return this._id;
  }

  public get email(): string {
    return this._email;
  }

  public get password(): string {
    return this._password;
  }
}
