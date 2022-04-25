import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Room } from '@collab-tools/datamodel';

export const CreateRoom = createAction('[Room] Create room');

export const CreateRoomSuccess = createAction(
  '[Room] Create room success',
  props<{ room: Room }>()
);

export const InviteUsersToRoom = createAction(
  '[Room] Invite users to room',
  props<{ usernames: string[]; roomId: string }>()
);

export const InviteUsersToRoomSuccess = createAction(
  '[Room] Invite users to room success',
  props<{ room: Room }>()
);

export const EjectUserFromRoom = createAction(
  '[Room] Remove users from room',
  props<{ roomId: string; userId: string }>()
);

export const EjectUserFromRoomSuccess = createAction(
  '[Room] Remove users from room success',
  props<{ room: Room }>()
);

export const JoinRoom = createAction(
  '[Room] Join room',
  props<{ roomId: string }>()
);

export const JoinRoomSuccess = createAction(
  '[Room] Join room success',
  props<{ room: Room }>()
);

export const LeaveRoom = createAction(
  '[Room] Leave room',
  props<{ roomId: string }>()
);

export const LeaveRoomSuccess = createAction(
  '[Room] Leave room success',
  props<{ room: Room }>()
);

export const GetOwnRoom = createAction('[Room] Get own room');

export const GetOwnRoomSuccess = createAction(
  '[Room] Get own room success',
  props<{ room: Room }>()
);

export const GetAllRooms = createAction('[Room] Get all rooms');

export const GetAllRoomsSuccess = createAction(
  '[Room] Get all room success',
  props<{ rooms: Room[] }>()
);

export const CloseRoom = createAction('[Room] Close room');

export const CloseRoomSuccess = createAction('[Room] Close room success');

export const SendCanvasInfos = createAction(
  '[Room] Send canvas infos',
  props<{ canvasInfos: string }>()
);

export const RoomError = createAction(
  '[Room] Room error',
  props<{ error: HttpErrorResponse }>()
);

export const ConnectToRoomWSSuccess = createAction(
  '[Room] Room Connect to room websocket success'
);
