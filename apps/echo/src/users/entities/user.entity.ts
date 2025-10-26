import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/better-sqlite';
import { v4 } from 'uuid';

import type { User } from '@orpheus/schemas';

@Entity({ tableName: 'user' })
export class UserEntity implements User {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property()
  password: string;

  @Property()
  username: string;

  @Property({ type: 'datetime' })
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date(), type: 'datetime' })
  updatedAt: Date & Opt = new Date();

  constructor(password: string, username: string) {
    this.password = password;
    this.username = username;
  }
}
