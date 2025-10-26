import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  type AccessToken,
  type SignInUser,
  type SignUpUser,
  epochMillisToDate,
} from '@orpheus/schemas';

import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async signIn(data: SignInUser): Promise<AccessToken> {
    const user = await this.usersService.verify(data);

    const { createdAt, id, updatedAt, username } = user;

    const payload: Omit<TokenPayload, 'exp' | 'iat'> = {
      sub: id,
      user: {
        createdAt: epochMillisToDate.encode(createdAt),
        updatedAt: epochMillisToDate.encode(updatedAt),
        username,
      },
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async signUp(data: SignUpUser): Promise<AccessToken> {
    const user = await this.usersService.create(data);

    const { createdAt, id, updatedAt, username } = user;

    const payload: Omit<TokenPayload, 'exp' | 'iat'> = {
      sub: id,
      user: {
        createdAt: epochMillisToDate.encode(createdAt),
        updatedAt: epochMillisToDate.encode(updatedAt),
        username,
      },
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
