import 'reflect-metadata';

import { env } from 'node:process';

import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { injectable } from 'tsyringe';

dotenv.config();

@injectable()
export class AuthToken {
  private payload!: jwt.JwtPayload;

  public verifyToken(token: string): boolean {
    try {
      this.payload = jwt.verify(token, env.JWT_SECRET as string) as jwt.JwtPayload;
      return true;
    } catch (error) {
      return false;
    }
  }

  public getPayload(): jwt.JwtPayload {
    return this.payload;
  }

  public generateToken(payload: jwt.JwtPayload): string {
    return jwt.sign(payload, env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
  }
}
