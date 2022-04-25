import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Notification, NotificationType } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-notification-list-item',
  templateUrl: './notification-list-item.component.html',
  styleUrls: ['./notification-list-item.component.scss'],
})
export class NotificationListItemComponent {
  @Input() notification: Notification;
  @Output() dismissedNotification = new EventEmitter<Notification>();
  public NotifType = NotificationType;
  constructor(
    @Inject('environment')
    public readonly environment
  ) {}

  public dismissNotification(notification: Notification): void {
    this.dismissedNotification.emit(notification);
  }
}
