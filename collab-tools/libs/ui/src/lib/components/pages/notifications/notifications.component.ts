import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import { Notification } from '@collab-tools/datamodel';
import {
  DeleteNotification,
  getAllNotifications,
  NotificationState,
} from '@collab-tools/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'collab-tools-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
})
export class NotificationsComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $notifications: Observable<Notification[]>;
  constructor(private readonly store: Store<NotificationState>) {
    super();
  }

  ngOnInit(): void {
    this.$notifications = this.store.select(getAllNotifications);
  }

  public onDismissNotification(notification: Notification): void {
    this.store.dispatch(
      DeleteNotification({ notificationId: notification._id })
    );
  }
}
