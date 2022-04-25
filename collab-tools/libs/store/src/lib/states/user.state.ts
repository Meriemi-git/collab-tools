import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import {
  Like,
  PageMetadata,
  PageOptions,
  UserDto,
} from '@collab-tools/datamodel';

export interface UserState extends EntityState<UserDto> {
  userInfos: UserDto;
  error: HttpErrorResponse;
  pageMetadata: PageMetadata;
  pageOptions: PageOptions;
  likes: Like[];
  suggestions: string[];
  confirmed: boolean;
  canConnectToWebsocket: boolean;
}
