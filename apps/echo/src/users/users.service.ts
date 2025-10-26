import { Injectable } from '@nestjs/common';

// This should be a real class/interface representing a user entity

export type User = {
  id: number;
  password: string;
  username: string;
};

@Injectable()
export class UsersService {
  private readonly users = [
    {
      id: 1,
      password: 'changeme',
      username: 'john',
    },
    {
      id: 2,
      password: 'guess',
      username: 'maria',
    },
  ];

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find((user) => user.username === username);
  }
}
