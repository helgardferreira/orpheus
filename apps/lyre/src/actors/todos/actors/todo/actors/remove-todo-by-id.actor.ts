import { from } from 'rxjs';
import { type ActorRefFrom, fromObservable } from 'xstate';

import type { ObservableCreator } from '@orpheus/actors';
import { removeTodoById } from '@orpheus/schemas';

type RemoveTodoByIdInput = {
  id: string;
};

const fromRemoveTodoById: ObservableCreator<void, RemoveTodoByIdInput> = ({
  input,
}) => from(removeTodoById(input.id));

export const removeTodoByIdLogic = fromObservable(fromRemoveTodoById);

export type RemoveTodoByIdActorRef = ActorRefFrom<typeof removeTodoByIdLogic>;
