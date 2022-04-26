import { HttpErrorResponse } from '@angular/common/http';
import { PageMetadata, PageOptions, UserDto } from '@collab-tools/datamodel';
import { EntityState } from '@ngrx/entity';

export interface UserState extends EntityState<UserDto> {
  userInfos: UserDto;
  error: HttpErrorResponse;
  pageMetadata: PageMetadata;
  pageOptions: PageOptions;
  suggestions: string[];
  confirmed: boolean;
  canConnectToWebsocket: boolean;
}
