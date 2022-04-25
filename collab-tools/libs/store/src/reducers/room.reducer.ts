import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Room } from '@collab-tools/datamodel';
import * as actions from '../actions/room.action';
import { RoomState } from '../states/room.state';

export const adapter: EntityAdapter<Room> = createEntityAdapter<Room>({
  sortComparer: sortByDate,
  selectId: (room: Room) => room._id,
});

export function sortByDate(a: Room, b: Room): number {
  return a.createdAt.getTime() - b.createdAt.getTime();
}

export const initialstate: RoomState = adapter.getInitialState({
  error: null,
  currentRoomId: null,
  ownRoomId: null,
  connectedToRoomWS: false,
});

const roomReducer = createReducer(
  initialstate,
  on(actions.CreateRoomSuccess, (state, { room }) => {
    return adapter.addOne(room, { ...state, ownRoomId: room._id, error: null });
  }),
  on(actions.JoinRoomSuccess, (state, { room }) => {
    return adapter.upsertOne(
      { ...room, joined: true },
      {
        ...state,
        error: null,
      }
    );
  }),
  on(actions.InviteUsersToRoomSuccess, (state, { room }) => {
    return adapter.updateOne(
      {
        id: room._id,
        changes: {
          members: room.members,
        },
      },
      {
        ...state,
      }
    );
  }),
  on(actions.EjectUserFromRoomSuccess, (state, { room }) => {
    return adapter.updateOne(
      {
        id: room._id,
        changes: {
          members: room.members,
        },
      },
      {
        ...state,
      }
    );
  }),
  on(actions.GetOwnRoomSuccess, (state, { room }) => {
    if (room) {
      return adapter.upsertOne(room, {
        ...state,
        ownRoomId: room._id,
        error: null,
      });
    } else {
      return state;
    }
  }),
  on(actions.GetAllRoomsSuccess, (state, { rooms }) => {
    if (rooms && rooms.length > 0) {
      return adapter.upsertMany(rooms, {
        ...state,
        error: null,
      });
    } else {
      return state;
    }
  }),
  on(actions.LeaveRoomSuccess, (state, { room }) => {
    return adapter.removeOne(room._id, { ...state, error: null });
  }),
  on(actions.CloseRoomSuccess, (state) => {
    return adapter.removeOne(state.ownRoomId, {
      ...state,
      error: null,
      ownRoomId: null,
    });
  }),
  on(actions.RoomError, (state, { error }) => ({
    ...state,
    error: error,
    accessToken: null,
  })),
  on(actions.ConnectToRoomWSSuccess, (state) => ({
    ...state,
    connectedToRoomWS: true,
  }))
);

export function reducer(state: RoomState | undefined, action: Action) {
  return roomReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
