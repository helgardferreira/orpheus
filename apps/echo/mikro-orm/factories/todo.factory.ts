import { faker } from '@faker-js/faker';
import type { EntityData } from '@mikro-orm/better-sqlite';
import { Factory } from '@mikro-orm/seeder';

import { TodoEntity } from '../../src/todos/entities';

export class TodoFactory extends Factory<TodoEntity, EntityData<TodoEntity>> {
  model = TodoEntity;

  override definition(input?: EntityData<TodoEntity>): EntityData<TodoEntity> {
    const completed = input?.completed ?? false;
    const createdAt = input?.createdAt
      ? new Date(input.createdAt)
      : faker.date.past();
    const description = input?.description ?? faker.food.description();
    const id = input?.id ?? faker.string.uuid();
    const title = input?.title ?? faker.food.dish();

    return {
      completed,
      createdAt,
      description,
      id,
      title,
    };
  }
}
