import { Entity, Opt, PrimaryKey, Property } from '@mikro-orm/better-sqlite';
import { v4 } from 'uuid';

import type { Todo } from '@orpheus/schemas';

@Entity({ tableName: 'todo' })
export class TodoEntity implements Todo {
  @PrimaryKey({ type: 'uuid' })
  id = v4();

  @Property({ type: 'boolean' })
  completed: boolean & Opt = false;

  @Property({ nullable: true })
  description: string | null;

  @Property()
  title: string;

  @Property({ type: 'datetime' })
  createdAt: Date & Opt = new Date();

  @Property({ onUpdate: () => new Date(), type: 'datetime' })
  updatedAt: Date & Opt = new Date();

  constructor(description: string | undefined, title: string) {
    this.description = description ?? null;
    this.title = title;
  }
}
