import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  type AccessToken,
  type SignInUser,
  type SignUpUser,
  UserSchema,
} from '@orpheus/schemas';

import { UsersService } from '../users/users.service';

// TODO: go through nestjs encryption and hashing docs - https://docs.nestjs.com/security/encryption-and-hashing
// TODO: continue here after creating `UserEntity` and `user` sqlite table...
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService
  ) {}

  async signIn(data: SignInUser): Promise<AccessToken> {
    const user = await this.usersService.findOneByUsername(data.username);

    if (user?.password !== data.password) {
      throw new UnauthorizedException();
    }

    const { createdAt, id, updatedAt, username } = UserSchema.encode(user);

    const payload: Omit<TokenPayload, 'exp' | 'iat'> = {
      sub: id,
      user: {
        createdAt,
        updatedAt,
        username,
      },
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }

  async signUp(data: SignUpUser): Promise<AccessToken> {
    const user = await this.usersService.create(data);

    const { createdAt, id, updatedAt, username } = UserSchema.encode(user);

    const payload: Omit<TokenPayload, 'exp' | 'iat'> = {
      sub: id,
      user: {
        createdAt,
        updatedAt,
        username,
      },
    };

    return { accessToken: await this.jwtService.signAsync(payload) };
  }
}
