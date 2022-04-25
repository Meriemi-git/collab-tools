import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  RoomChannel,
  RoomEvent,
  RoomMemberRequest,
  WebsocketMember,
  WebsocketMemberRole,
  WebsocketMemberStatus,
  WebsocketMessage,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import { Namespace, Socket } from 'socket.io';
import { WebSocketExceptionFilter } from '../../filters/websocket-exception-filter';
import { Strategies } from '../../strategies/strategies';
import { WebsocketStrategy } from '../../strategies/websocket.strategy';
import { CookieParser } from '../../utils/cookie-parser';
import { JwtTokenService } from '../shared/jwt-token.service';
import { UserService } from '../user/user.service';
import { RoomService } from './room.service';

@Injectable()
@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: {
    origin: 'http://localhost:4200',
    allowedHeaders: ['x-access-token'],
    credentials: true,
  },
  namespace: 'rooms',
})
@UseFilters(new WebSocketExceptionFilter())
export class RoomGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RoomGateway.name);

  @WebSocketServer()
  private readonly server: Namespace;

  constructor(
    @Inject(forwardRef(() => RoomService))
    private readonly roomService: RoomService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  /**
   * Handle connection of a client
   * @param client socket of the client
   */
  public async handleConnection(client: Socket) {
    this.logger.debug('Room Connection');
    const userId = this.getUserIdFromCookies(client) as string;
    if (!userId) {
      client.disconnect();
    } else {
      this.userService.setRoomSocketId(userId, client.id);
    }
  }

  /**
   * Handle disconnection of a client
   * @param client socket of the client
   */
  public async handleDisconnect(client: Socket) {
    this.logger.debug('Room Disconnection');
    const userId = this.getUserIdFromCookies(client) as string;
    const room = await this.roomService.getMyConnectedRoom(userId);
    if (room) {
      const updatedRoom = await this.roomService.updateRoomMemberStatus(
        userId,
        room._id,
        WebsocketStatus.DISCONNECTED,
        null
      );
      if (!updatedRoom) {
        throw new BadRequestException();
      }
      const disconnectedStatus: WebsocketMemberStatus = {
        wsRoomId: room._id.toString(),
        userId: userId,
        status: WebsocketStatus.DISCONNECTED,
        username: updatedRoom.members.find(
          (m) => m.userId.toString() === userId
        )?.username,
      };
      client.broadcast
        .to(room._id.toString())
        .emit(RoomEvent.ON_MEMBER_STATUS_CHANGED, disconnectedStatus);
    }
    client.disconnect(true);
  }

  public joinRoom(roomId: string, member: WebsocketMember) {
    const client = this.server.sockets.get(member.socketId);
    client.join(roomId);
    // Check periodically if user can stay connected to the room
    client.on('packet', async (packet) => {
      if (packet.type === 'pong') {
        this.checkRoomStatus(client, member.userId, roomId);
      }
    });
    const joinedStatus: WebsocketMemberStatus = {
      wsRoomId: roomId,
      userId: member.userId,
      status: WebsocketStatus.JOINED,
      username: member.username,
    };

    this.server
      .to(roomId)
      .volatile.emit(RoomEvent.ON_MEMBER_STATUS_CHANGED, joinedStatus);
  }

  public leaveRoom(roomId: string, member: WebsocketMember) {
    const client = this.server.sockets.get(member.socketId);
    client.removeAllListeners('packet');
    const leavedStatus: WebsocketMemberStatus = {
      wsRoomId: roomId,
      userId: member.userId.toString(),
      status: WebsocketStatus.LEAVED,
      username: member.username,
    };
    this.server
      .to(roomId)
      .emit(RoomEvent.ON_MEMBER_STATUS_CHANGED, leavedStatus);
  }

  public ejectUserFromRoom(member: WebsocketMember, roomId: string): void {
    const socket = this.server.sockets.get(member.socketId);
    if (socket) {
      const ejectedStatus: WebsocketMemberStatus = {
        wsRoomId: roomId,
        userId: member.userId,
        status: WebsocketStatus.EJECTED,
        username: member.username,
      };
      // Remove listener to check if user can stay in room on each ping
      socket.removeAllListeners('packet');
      this.server
        .to(roomId)
        .emit(RoomEvent.ON_MEMBER_STATUS_CHANGED, ejectedStatus);
      socket.disconnect();
    }
  }

  public closeRoom(roomId: string, owner: WebsocketMember) {
    const closedStatus: WebsocketMemberStatus = {
      wsRoomId: roomId,
      userId: owner.userId.toString(),
      status: WebsocketStatus.CLOSED,
      username: owner.username,
    };
    this.server
      .to(roomId)
      .emit(RoomEvent.ON_MEMBER_STATUS_CHANGED, closedStatus);
    this.server.in(roomId).disconnectSockets();
  }

  @UseGuards(AuthGuard(Strategies.WebsocketStrategy))
  @SubscribeMessage(RoomChannel.BROADCAST_OBJECT_LIST)
  public async broadcastObjects(
    @MessageBody() message: WebsocketMessage,
    @ConnectedSocket() client: Socket
  ) {
    this.logger.debug(RoomChannel.BROADCAST_OBJECT_LIST);
    // Send object list compressed to all clients except the owner
    client.broadcast
      .to(message.wsRoomId)
      .emit(RoomEvent.ON_OBJECTS_BROADCASTED, message.payload);
  }

  @UseGuards(AuthGuard(Strategies.WebsocketStrategy))
  @SubscribeMessage(RoomChannel.ASK_OBJECTS_FROM_LIST)
  public async askObjectsFromList(
    @MessageBody() message: WebsocketMessage,
    @ConnectedSocket() client: Socket
  ) {
    this.logger.debug(RoomChannel.ASK_OBJECTS_FROM_LIST);
    const userId = this.getUserIdFromCookies(client) as string;
    const isMember = await this.roomService.isMemberOfRoom(
      message.wsRoomId,
      userId
    );
    if (!isMember) {
      throw new ForbiddenException();
    }
    const room = await this.roomService.getOpenRoomById(message.wsRoomId);
    if (room) {
      // Get the owner of the room
      const ownerMember = room.members.find(
        (m) => m.role === WebsocketMemberRole.OWNER
      );
      // Send him the asked object List
      if (ownerMember?.socketId) {
        const ownerSocket = this.server.sockets.get(ownerMember.socketId);
        const request: RoomMemberRequest = {
          memberId: userId,
          payload: message.payload,
        };
        ownerSocket.emit(RoomEvent.ON_OBJECTS_AKED, request);
      }
    }
  }

  @UseGuards(AuthGuard(Strategies.WebsocketStrategy))
  @SubscribeMessage(RoomChannel.SEND_PLAIN_OBJECTS)
  public async sendObjects(@MessageBody() message: WebsocketMessage) {
    this.logger.debug(RoomChannel.SEND_PLAIN_OBJECTS);
    const request = message.payload as RoomMemberRequest;
    const room = await this.roomService.getOpenRoomById(message.wsRoomId);
    if (room) {
      const recipient = room.members.find(
        (m) => m.userId.toString() === request.memberId
      );
      if (recipient) {
        const socket = this.server.sockets.get(recipient.socketId);
        if (socket) {
          socket.emit(RoomEvent.ON_OBJECTS_SENT, request.payload);
        }
      }
    }
  }

  public getUserIdFromCookies(client: Socket): unknown {
    try {
      return this.jwtTokenService.decodeToken(
        CookieParser.GetCookieValue(
          WebsocketStrategy.X_WS_TOKEN,
          client?.handshake?.headers?.cookie
        )
      )['userId'];
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if a user can stay is a room (if it is closed or user was ejected previously)
   * @param client socket of the user
   * @param userId id of the user
   * @param roomId id of the room
   */
  private checkRoomStatus(
    client: Socket,
    userId: string,
    roomId: string
  ): void {
    this.roomService.canStayInRoom(userId, roomId).then((canStay) => {
      if (!canStay) {
        client.disconnect();
      }
    });
  }
}
