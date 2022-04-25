import { NgModule } from '@angular/core';
import { ChatWebSocketService } from './services/chat-websocket.service';
import { NotificationWebSocketService } from './services/notification-websocket.service';
import { RoomWebSocketService } from './services/room-websocket.service';

@NgModule({
  providers: [
    RoomWebSocketService,
    ChatWebSocketService,
    NotificationWebSocketService,
  ],
})
export class WebsocketModule {}
