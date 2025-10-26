import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

import type {
  SignInUser,
  SignUpUser,
  UpdateUser,
  User,
} from '@orpheus/schemas';

import { AuthConfig } from '../common/schemas';

import { UserEntity } from './entities';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService<AuthConfig>,
    private readonly em: EntityManager,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>
  ) {}

  async create(data: SignUpUser): Promise<User> {
    const { password, username } = data;

    const hasExisting = !!(await this.userRepository.findOne({
      username: data.username,
    }));

    if (hasExisting) throw new ConflictException('Username already taken');

    const hashedPassword = await this.hashPassword(password);

    const user = this.userRepository.create({
      password: hashedPassword,
      username,
    });
    await this.em.flush();

    return user;
  }

  async delete(id: string): Promise<void> {
    const count = await this.userRepository.nativeDelete(id);

    if (count === 0) throw new UnauthorizedException();
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new UnauthorizedException();

    return user;
  }

  async update(id: string, data: UpdateUser): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) throw new UnauthorizedException();

    let hashedPassword: string | undefined;

    if (data.password) {
      const isValid = await this.compareHash(
        data.previousPassword,
        user.password
      );

      if (!isValid) throw new UnauthorizedException();

      hashedPassword = await this.hashPassword(data.password);
    }

    wrap(user).assign(
      { password: hashedPassword, username: data.username },
      { ignoreUndefined: true }
    );
    await this.em.flush();

    return user;
  }

  async verify(data: SignInUser): Promise<User> {
    const user = await this.userRepository.findOne({ username: data.username });

    if (!user) throw new UnauthorizedException();

    const isValid = await this.compareHash(data.password, user.password);

    if (!isValid) throw new UnauthorizedException();

    return user;
  }

  private async compareHash(password: string, hash: string): Promise<boolean> {
    try {
      return await new Promise<boolean>((resolve, reject) =>
        bcrypt.compare(password, hash, (err, result) =>
          err ? reject(err) : resolve(result)
        )
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    try {
      return await new Promise<string>((resolve, reject) =>
        bcrypt.hash(
          password,
          this.configService.getOrThrow<AuthConfig['HASH_SALT_ROUNDS']>(
            'HASH_SALT_ROUNDS'
          ),
          (err, hash) => (err ? reject(err) : resolve(hash))
        )
      );
    } catch {
      throw new InternalServerErrorException();
    }
  }
}
