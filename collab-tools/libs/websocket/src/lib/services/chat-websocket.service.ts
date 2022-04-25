import { Inject, Injectable } from '@angular/core';
import { IChatSocketListener } from '@collab-tools/bases';
import {
  ChatEvent,
  ChatMessage,
  WebsocketMemberStatus,
} from '@collab-tools/datamodel';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class ChatWebSocketService {
  private socket: Socket;
  public $messages = new Subject<ChatMessage>();
  public $status = new Subject<WebsocketMemberStatus>();
  private readonly environment;
  private listener: IChatSocketListener;

  constructor(
    @Inject('environment')
    environment
  ) {
    this.environment = environment;
    this.$messages.subscribe((message: ChatMessage) => {
      this.listener.onMessageReceived(message);
    });

    this.$status.subscribe((status: WebsocketMemberStatus) => {
      this.listener.onStatusChanged(status);
    });
  }

  public connectToWS(listener: IChatSocketListener) {
    this.listener = listener;
    if (this.socket?.connected) {
      return;
    }
    this.socket = io(this.environment.websocketChatUrl, {
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
    this.socket.on(ChatEvent.ON_MESSAGES, (data) => {
      this.$messages.next(data);
    });
    this.socket.on(ChatEvent.ON_MEMBER_STATUS_CHANGED, (data) => {
      this.$status.next(data);
    });
  }

  public disconnect(): void {
    if (this.socket && this.socket.connected) {
      this.socket.disconnect();
    }
    this.$messages.unsubscribe();
    this.$status.unsubscribe();
  }

  public isConnected(): boolean {
    return this.socket != null && this.socket.connected;
  }
}
