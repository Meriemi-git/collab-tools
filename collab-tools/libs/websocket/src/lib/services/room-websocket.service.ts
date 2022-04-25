import { Inject, Injectable } from '@angular/core';
import { AbstractRoomListenerComponent } from '@collab-tools/bases';
import {
  CanvasDetails,
  RoomChannel,
  RoomEvent,
  RoomMemberRequest,
  WebsocketMemberStatus,
  WebsocketMessage,
} from '@collab-tools/datamodel';
import * as pako from 'pako';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable()
export class RoomWebSocketService {
  private socket: Socket;
  public $status = new Subject<WebsocketMemberStatus>();
  public $objectsBroadcast = new Subject<Buffer>();
  public $objectsSent = new Subject<Buffer>();
  public $objectsAsked = new Subject<RoomMemberRequest>();
  public $exceptions = new Subject<number>();

  private readonly environment;

  private listener: AbstractRoomListenerComponent;

  constructor(
    @Inject('environment')
    environment
  ) {
    this.environment = environment;

    this.$status.subscribe((status: WebsocketMemberStatus) => {
      this.listener.onMemberStatusChange(status);
    });

    this.$objectsBroadcast.subscribe((data: Buffer) => {
      const uncompressed = pako.inflate(data, {
        to: 'string',
      });
      this.listener.onBroadcastObjectList(JSON.parse(uncompressed));
    });

    this.$objectsSent.subscribe((data: Buffer) => {
      const uncompressed = pako.inflate(data, {
        to: 'string',
      });
      this.listener.onObjectListSent(JSON.parse(uncompressed));
    });

    this.$objectsAsked.subscribe((request: RoomMemberRequest) => {
      this.listener.onAskObjectsFromList(
        JSON.parse(request.payload as string),
        request.memberId
      );
    });

    this.$exceptions.subscribe((code: number) => {
      this.listener.onException(code);
    });
  }

  public connectToWS(listener: AbstractRoomListenerComponent) {
    this.listener = listener;
    if (this.socket?.connected) {
      return;
    }
    this.socket = io(this.environment.websocketRoomUrl, {
      reconnection: true,
      withCredentials: true,
    });
    this.socket.on('connect', () => {
      this.listener.onConnectedToWS();
    });
    this.socket.on('disconnect', (reason) => {
      listener.onConnectionClosed(reason);
    });
    this.dispatchEvents();
  }

  private dispatchEvents() {
    this.socket.on(RoomEvent.ON_MEMBER_STATUS_CHANGED, (data) => {
      this.$status.next(data);
    });
    this.socket.on(RoomEvent.ON_OBJECTS_AKED, (data) => {
      this.$objectsAsked.next(data);
    });
    this.socket.on(RoomEvent.ON_OBJECTS_BROADCASTED, (data) => {
      this.$objectsBroadcast.next(data);
    });
    this.socket.on(RoomEvent.ON_OBJECTS_SENT, (data) => {
      this.$objectsSent.next(data);
    });
    this.socket.on(RoomEvent.ON_EXCEPTION, (data) => {
      this.$exceptions.next(data);
    });
  }

  public broadcastObjects(wsRoomId: string, details: CanvasDetails) {
    const binaryPayload = pako.deflate(JSON.stringify(details));
    const roomMessage: WebsocketMessage = {
      payload: binaryPayload,
      wsRoomId,
    };

    this.socket.emit(RoomChannel.BROADCAST_OBJECT_LIST, roomMessage);
  }

  public askObjects(wsRoomId: string, objectList: string[]) {
    const roomMessage: WebsocketMessage = {
      payload: JSON.stringify(objectList),
      wsRoomId,
    };
    this.socket.emit(RoomChannel.ASK_OBJECTS_FROM_LIST, roomMessage);
  }

  public sendObjects(
    wsRoomId: string,
    objectList: unknown[],
    memberId: string
  ) {
    const request: RoomMemberRequest = {
      memberId,
      payload: pako.deflate(JSON.stringify(objectList)),
    };
    const roomMessage: WebsocketMessage = {
      payload: request,
      wsRoomId,
    };

    this.socket.emit(RoomChannel.SEND_PLAIN_OBJECTS, roomMessage);
  }

  public onDisconnect(): void {
    this.$status.unsubscribe();
    this.$objectsAsked.unsubscribe();
    this.$objectsBroadcast.unsubscribe();
    this.$objectsSent.unsubscribe();
    this.$exceptions.unsubscribe();
  }

  public isConnected(): boolean {
    return this.socket != null && this.socket.connected;
  }
}
