import type { ActorRef, Snapshot } from 'xstate';
import type * as z from 'zod';

import type { CreateTodo, Todo, UpdateTodo } from '@orpheus/schemas';

type ParentActor = ActorRef<
  Snapshot<unknown>,
  { type: 'REMOVE_CHILD'; id: string } | { type: 'SPAWN_CHILD'; todo: Todo }
>;

type TodoActorContext = Omit<Todo, 'createdAt' | 'id' | 'updatedAt'> &
  Partial<Pick<Todo, 'createdAt' | 'id' | 'updatedAt'>> & {
    createTodoError?: z.ZodError<CreateTodo>;
    parentActor: ParentActor;
    updateTodoError?: z.ZodError<UpdateTodo>;
  };

type TodoActorInput = {
  parentActor: ParentActor;
  todo: Partial<Todo>;
};

type ChangeEvent = {
  type: 'CHANGE';
} & UpdateTodo;

type CreateSuccessEvent = {
  type: 'CREATE_SUCCESS';
  todo: Todo;
};

type RemoveEvent = {
  type: 'REMOVE';
};

type SaveEvent = {
  type: 'SAVE';
};

type UpdateSuccessEvent = {
  type: 'UPDATE_SUCCESS';
  todo: Todo;
};

type TodoActorEvent =
  | ChangeEvent
  | CreateSuccessEvent
  | RemoveEvent
  | SaveEvent
  | UpdateSuccessEvent;

export type {
  ChangeEvent,
  CreateSuccessEvent,
  RemoveEvent,
  SaveEvent,
  TodoActorContext,
  TodoActorEvent,
  TodoActorInput,
  UpdateSuccessEvent,
};
