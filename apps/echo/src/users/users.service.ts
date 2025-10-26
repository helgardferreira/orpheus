import { EntityManager, EntityRepository } from '@mikro-orm/better-sqlite';
import { wrap } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import type { SignUpUser, UpdateUser, User } from '@orpheus/schemas';

import { UserEntity } from './entities';

@Injectable()
export class UsersService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(UserEntity)
    private readonly userRepository: EntityRepository<UserEntity>
  ) {}

  async create(data: SignUpUser): Promise<User> {
    const { password, username } = data;

    const user = this.userRepository.create({
      password,
      username,
    });
    await this.em.flush();

    return user;
  }

  async findOneById(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  async findOneByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ username });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  // TODO: implement hashing and salting here
  // TODO: continue here...
  async update(id: string, data: UpdateUser): Promise<User> {
    const user = await this.userRepository.findOne(id);

    if (!user || data.previousPassword !== user.password) {
      throw new UnauthorizedException();
    }

    wrap(user).assign(
      { password: data.password, username: data.username },
      { ignoreUndefined: true }
    );
    await this.em.flush();

    return user;
  }

  async delete(id: string): Promise<void> {
    const count = await this.userRepository.nativeDelete(id);

    if (count === 0) {
      throw new UnauthorizedException();
    }
  }
}
