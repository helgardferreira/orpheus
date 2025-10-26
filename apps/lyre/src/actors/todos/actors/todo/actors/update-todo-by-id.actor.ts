import { from, map } from 'rxjs';
import { type ActorRefFrom, fromEventObservable } from 'xstate';

import type { EventObservableCreator } from '@orpheus/actors';
import { type UpdateTodo, updateTodoById } from '@orpheus/schemas';

import type { TodoActorEvent } from '../types';

type UpdateTodoByIdInput = {
  id: string;
  todo: UpdateTodo;
};

const fromUpdateTodoById: EventObservableCreator<
  TodoActorEvent,
  UpdateTodoByIdInput
> = ({ input }) =>
  from(updateTodoById(input.id, input.todo)).pipe(
    map((todo) => ({ type: 'UPDATE_SUCCESS', todo }))
  );

export const updateTodoByIdLogic = fromEventObservable(fromUpdateTodoById);

export type UpdateTodoByIdActorRef = ActorRefFrom<typeof updateTodoByIdLogic>;
