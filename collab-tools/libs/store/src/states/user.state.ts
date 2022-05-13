import { HttpErrorResponse } from '@angular/common/http';
import {
  AnonUser,
  PageMetadata,
  PageOptions,
  UserDto,
} from '@collab-tools/datamodel';
import { EntityState } from '@ngrx/entity';

export interface UserState extends EntityState<UserDto> {
  userInfos: UserDto;
  anonUser: AnonUser;
  error: HttpErrorResponse;
  pageMetadata: PageMetadata;
  pageOptions: PageOptions;
  suggestions: string[];
  canConnectToWebsocket: boolean;
}
