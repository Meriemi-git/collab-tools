import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { Room } from '@collab-tools/datamodel';

export interface RoomState extends EntityState<Room> {
  error: HttpErrorResponse;
  currentRoomId: string;
  ownRoomId: string;
  connectedToRoomWS: boolean;
}
