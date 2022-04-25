import { Notification } from '@collab-tools/datamodel';

export interface INotificationSocketListener {
  onConnectionClosed(reason: string): void;
  onNotificationReceived(notification: Notification): void;
}
