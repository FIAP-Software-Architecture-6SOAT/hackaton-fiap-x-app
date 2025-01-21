import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import type { AuthTokenGateway, UserGateway } from '@/adapters/gateways';
import type { User } from '@/domain/entities';
import { Email } from '@/domain/value-objects';

dotenv.config();

export class UserUseCase {
  public constructor(
    private readonly userGateway: UserGateway,
    private readonly authTokenGateway: AuthTokenGateway
  ) {}

  public async create({ email, password }: Omit<User, 'id'>): Promise<string> {
    const validEmail = new Email(email);
    const passwordHash = bcrypt.hashSync(password, 10);
    return this.userGateway.create(validEmail.getValue(), passwordHash);
  }

  public async login({ email, password }: Omit<User, 'id'>): Promise<string> {
    const user = await this.userGateway.findOne(email);
    if (!user) throw new Error('Invalid email or password');

    const match = (await bcrypt.compare(password, user.password)) as boolean;
    if (!match) throw new Error('Invalid email or password');

    const payload = {
      id: user.id,
      email: user.email,
    };

    const authToken = this.authTokenGateway.generateToken(payload);

    return authToken;
  }
}
