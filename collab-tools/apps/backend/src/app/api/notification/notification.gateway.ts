import { Notification, NotificationEvent } from '@collab-tools/datamodel';
import { Injectable, Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Namespace, Socket } from 'socket.io';
import { WebsocketDrawegy } from '../../drawegies/websocket.drawegy';
import { CookieParser } from '../../utils/cookie-parser';
import { JwtTokenService } from '../shared/jwt-token.service';
import { UserService } from '../user/user.service';

@Injectable()
@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
  namespace: 'notifications',
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationGateway.name);

  @WebSocketServer()
  private readonly server: Namespace;

  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  handleConnection(client: Socket, ...args: unknown[]) {
    this.logger.debug('Chat Connexion');
    const userId = this.getUserIdFromCookies(client);
    if (!userId) {
      this.logger.debug("User doesn't exists");
      client.disconnect();
    } else {
      this.userService.setNotificationSocketId(userId, client.id);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.debug('Notification disconnexion');
  }

  sendChatInvitationNotification(
    socketId: string,
    notification: Notification
  ): void {
    const ownerSocket = this.server.sockets.get(socketId);
    if (ownerSocket) {
      ownerSocket.emit(NotificationEvent.ON_CHAT_INVITATION, notification);
    }
  }

  sendRoomInvitationNotification(
    socketId: string,
    notification: Notification
  ): void {
    const ownerSocket = this.server.sockets.get(socketId);
    if (ownerSocket) {
      ownerSocket.emit(NotificationEvent.ON_ROOM_INVITATION, notification);
    }
  }

  public getUserIdFromCookies(client: Socket): unknown {
    try {
      return this.jwtTokenService.decodeToken(
        CookieParser.GetCookieValue(
          WebsocketDrawegy.X_WS_TOKEN,
          client?.handshake?.headers?.cookie
        )
      )['userId'];
    } catch (error) {
      return null;
    }
  }
}
