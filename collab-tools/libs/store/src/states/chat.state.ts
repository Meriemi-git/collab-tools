import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { Chat } from '@collab-tools/datamodel';

export interface ChatState extends EntityState<Chat> {
  error: HttpErrorResponse;
  currentChatId: string;
}
