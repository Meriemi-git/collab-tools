import {
  Chat,
  ChatChannel,
  ChatEvent,
  ChatMessage,
  WebsocketMember,
  WebsocketMemberStatus,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
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
import { ChatService } from './chat.service';

@Injectable()
@WebSocketGateway({
  transports: ['polling', 'websocket'],
  cors: {
    origin: 'http://localhost:4200',
    credentials: true,
  },
  namespace: 'chats',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  private readonly server: Namespace;

  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  /**
   * Handle connection of a client
   * @param client socket of the client
   */
  public async handleConnection(client: Socket) {
    this.logger.debug('Chat Connexion');
    const userId = this.getUserIdFromCookies(client);
    if (!userId) {
      this.logger.debug("User doesn't exists");
      client.disconnect();
    } else {
      this.userService.setChatSocketId(userId, client.id);
    }
  }

  /**
   * Handle disconnection of a client
   * @param client socket of the client
   */
  public async handleDisconnect(client: Socket) {
    this.logger.debug('Chat Disconnection');
    const userId = this.getUserIdFromCookies(client);
    if (userId) {
      const chatIds: string[] = await this.chatService.getUserChatIds(userId);
      chatIds.forEach((chatId) => {
        this.chatService
          .updateChatMemberStatus(
            userId,
            chatId,
            WebsocketStatus.DISCONNECTED,
            null
          )
          .then((chat) => {
            if (chat) {
              const disconnectedStatus: WebsocketMemberStatus = {
                wsRoomId: chat._id.toString(),
                userId: userId,
                status: WebsocketStatus.DISCONNECTED,
                username: chat.members.find(
                  (m) => m.userId.toString() === userId
                )?.username,
              };
              client
                .to(chatId)
                .emit(ChatEvent.ON_MEMBER_STATUS_CHANGED, disconnectedStatus);
              client.disconnect(true);
            }
          });
      });
    }
  }

  public joinChat(chatId: string, member: WebsocketMember) {
    this.logger.debug(ChatChannel.JOIN);
    const client = this.server.sockets.get(member.socketId);
    if (client) {
      client.join(chatId);
      const joinedStatus: WebsocketMemberStatus = {
        wsRoomId: chatId,
        userId: member.userId.toString(),
        status: WebsocketStatus.JOINED,
        username: member.username,
      };
      this.server
        .to(chatId)
        .emit(ChatEvent.ON_MEMBER_STATUS_CHANGED, joinedStatus);
    }
  }

  public leaveChat(chatId: string, member: WebsocketMember) {
    this.logger.debug(ChatChannel.LEAVE);
    const client = this.server.sockets.get(member.socketId);
    if (client) {
      client.leave(chatId);
      const joinedStatus: WebsocketMemberStatus = {
        wsRoomId: chatId,
        userId: member.userId.toString(),
        status: WebsocketStatus.LEAVED,
        username: member.username,
      };
      this.server
        .to(chatId)
        .emit(ChatEvent.ON_MEMBER_STATUS_CHANGED, joinedStatus);
    }
  }

  public sendMessage(
    chatId: string,
    message: ChatMessage,
    chatMember: WebsocketMember
  ) {
    this.logger.debug(ChatChannel.MESSAGES);
    const client = this.server.sockets.get(chatMember.socketId);
    if (client) {
      client.broadcast.to(chatId).emit(ChatEvent.ON_MESSAGES, message);
    }
  }

  public closeChat(chat: Chat) {
    this.logger.debug(ChatChannel.CLOSE_CHAT);
    const closedStatus: WebsocketMemberStatus = {
      wsRoomId: chat._id.toString(),
      userId: null,
      status: WebsocketStatus.LEAVED,
      username: null,
    };
    this.server
      .to(chat._id.toString())
      .emit(ChatEvent.ON_MEMBER_STATUS_CHANGED, closedStatus);
    chat.members.forEach((member) => {
      const client = this.server.sockets.get(member.socketId);
      if (client) {
        client.leave(chat._id.toString());
      }
    });
  }

  public getUserIdFromCookies(client: Socket): string {
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
