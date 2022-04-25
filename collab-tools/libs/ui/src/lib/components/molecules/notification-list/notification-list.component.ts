import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Notification, NotificationType } from '@collab-tools/datamodel';
@Component({
  selector: 'collab-tools-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
})
export class NotificationListComponent {
  @Input()
  public notifications: Notification[];
  @Output()
  public dismissedNotification = new EventEmitter<Notification>();

  public NType = NotificationType;

  public onDismissNotification(notification: Notification) {
    this.dismissedNotification.emit(notification);
  }
}
