import { Inject, Injectable } from '@angular/core';
import { INotificationSocketListener } from '@collab-tools/bases';
import { Notification, NotificationEvent } from '@collab-tools/datamodel';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class NotificationWebSocketService {
  private socket: Socket;
  public $notifications = new Subject<Notification>();
  private readonly environment;
  private listener: INotificationSocketListener;

  constructor(
    @Inject('environment')
    environment
  ) {
    this.environment = environment;
    this.$notifications.subscribe((notification: Notification) => {
      this.listener.onNotificationReceived(notification);
    });
  }

  public connectToWS(listener: INotificationSocketListener) {
    this.listener = listener;
    if (this.socket?.connected) {
      return;
    }
    this.socket = io(this.environment.websocketNotificationUrl, {
      reconnection: true,
      withCredentials: true,
    });
    this.socket.on('connect', () => {
      this.socket.sendBuffer = [];
    });
    this.socket.on('disconnect', (reason) => {
      listener.onConnectionClosed(reason);
    });
    this.dispatchChatEvents();
  }

  private dispatchChatEvents() {
    this.socket.on(NotificationEvent.ON_CHAT_INVITATION, (data) => {
      this.$notifications.next(data);
    });
    this.socket.on(NotificationEvent.ON_ROOM_INVITATION, (data) => {
      this.$notifications.next(data);
    });
  }
}
