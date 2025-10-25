import { compareDesc } from 'date-fns';
import { from, map } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@orpheus/actors';
import { findAllTodos } from '@orpheus/schemas';

import type { TodosActorEvent } from '../types';

const fromFindAllTodos: EventObservableCreator<TodosActorEvent> = () =>
  from(findAllTodos()).pipe(
    map((todos) => ({
      type: 'LOAD_SUCCESS',
      todos: todos.toSorted((a, b) => compareDesc(a.createdAt, b.createdAt)),
    }))
  );

export const findAllTodosLogic = fromEventObservable(fromFindAllTodos);

export type FindAllTodosActorRef = ActorRefFrom<typeof findAllTodosLogic>;
