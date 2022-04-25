import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WebsocketStatus } from '@collab-tools/datamodel';
import { selectAll } from '../reducers/room.reducer';
import { RoomState } from '../states/room.state';

const agentFeature = createFeatureSelector<RoomState>('RoomState');
export const selectRoomState = createSelector(
  agentFeature,
  (state: RoomState) => state
);

export const getOwnRoom = createSelector(
  selectRoomState,
  (state: RoomState) => state.entities[state.ownRoomId]
);

export const getAllRooms = createSelector(selectRoomState, selectAll);

export const isUserJoined = (userId: string) =>
  createSelector(getOwnRoom, (room) => {
    return room.members.some(
      (u) => u.userId === userId && u.status === WebsocketStatus.JOINED
    );
  });

export const isRoomJoined = (roomId: string) =>
  createSelector(selectRoomState, (state) => state.entities[roomId]?.joined);

export const isConnectedToRoomWS = createSelector(
  selectRoomState,
  (state: RoomState) => state.connectedToRoomWS
);
