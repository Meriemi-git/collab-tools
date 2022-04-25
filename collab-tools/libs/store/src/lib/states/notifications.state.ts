import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { Notification, TranslateMessage } from '@collab-tools/datamodel';

export interface NotificationState extends EntityState<Notification> {
  toBeDisplayed: TranslateMessage;
  error: HttpErrorResponse;
}
