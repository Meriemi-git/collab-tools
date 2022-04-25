import {
  Chat,
  ChatDocument,
  ChatMessage,
  NotificationType,
  UserDto,
  WebsocketMember,
  WebsocketMemberRole,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { ChatGateway } from './chat.gateway';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatDocument>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => ChatGateway))
    private readonly chatGateway: ChatGateway
  ) {}

  public async getOpenChats(userId: string): Promise<Chat[]> {
    return this.chatModel
      .find(
        {
          closed: false,
          members: {
            $elemMatch: { userId },
          },
        },
        { messages: { $slice: [0, 10] } }
      )
      .sort('-createdAt')
      .exec();
  }

  public async createChat(
    creator: UserDto,
    usernames: string[]
  ): Promise<Chat> {
    const users = await this.userService.getUsersByUsernames(usernames);
    const members: WebsocketMember[] = [];
    users.forEach((user) =>
      members.push({
        userId: user._id,
        username: user.username,
        socketId: null,
        status: WebsocketStatus.UNKNOWN,
        role: WebsocketMemberRole.OWNER,
      })
    );
    const newChat = new this.chatModel({
      createdAt: new Date(),
      creatorId: creator._id,
      members: [
        ...members,
        {
          userId: creator._id,
          username: creator.username,
          socketId: null,
          status: WebsocketStatus.UNKNOWN,
          role: WebsocketMemberRole.OWNER,
        },
      ],
      messages: [
        {
          content: 'Hello Chat !',
          sendAt: new Date(),
        },
      ],
      closed: false,
    });
    return newChat.save();
  }

  public async updateChatMemberStatus(
    userId: string,
    chatId: string,
    status: WebsocketStatus,
    socketId: string
  ): Promise<Chat> {
    return this.chatModel
      .findOneAndUpdate(
        { _id: chatId, closed: false },
        {
          $set: {
            'members.$[element].status': status,
            'members.$[element].socketId': socketId,
          },
        },
        {
          arrayFilters: [{ 'element.userId': userId }],
          new: true,
        }
      )
      .exec();
  }

  public async closeChat(chatId: string, ownerId: string): Promise<Chat> {
    const chat = await this.chatModel
      .findOneAndUpdate(
        { _id: chatId, ownerId, closed: false },
        { closed: true },
        {
          new: true,
        }
      )
      .exec();
    if (chat) {
      this.chatGateway.closeChat(chat);
    }
    return chat;
  }

  public async leaveChat(chatId: string, userId: string): Promise<Chat> {
    const chat = await this.chatModel
      .findOne({ _id: chatId, close: false })
      .exec();
    const member = chat.members.find((m) => m.userId.toString() === userId);
    if (member) {
      this.chatGateway.leaveChat(chatId, member);
      chat.members = chat.members.filter((m) => m.userId.toString() !== userId);
      if (chat.members.length == 0) {
        chat.closed = true;
      }
      return chat.save();
    } else {
      throw new BadRequestException();
    }
  }

  public async inviteUsers(
    chatId: string,
    usernames: string[],
    ownerId: string
  ): Promise<Chat> {
    const users = await this.userService.getUsersByUsernames(usernames);
    const chat = await this.chatModel.findOne({ _id: chatId, ownerId }).exec();
    if (chat && users && users.length > 0) {
      if (chat.members.length + users.length > 10) {
        throw new HttpException('Too many room members', 467);
      }
      if (
        chat.members.some((m) =>
          users.some((u) => u._id.toString() === m.userId.toString())
        )
      ) {
        throw new HttpException('User already present', 468);
      }
      users.forEach((user) => {
        chat.members.push({
          _id: null,
          status: WebsocketStatus.UNKNOWN,
          socketId: null,
          userId: user._id,
          username: user.username,
          role: WebsocketMemberRole.VIEWER,
        } as WebsocketMember);
        this.notificationService.sendNotification(
          user._id.toString(),
          chatId,
          user.notificationSocketId,
          NotificationType.CHAT_INVITATION
        );
      });
      return chat.save();
    } else {
      throw new BadRequestException();
    }
  }

  public async addMessageToChat(
    chatId: string,
    userId: string,
    content: string
  ): Promise<ChatMessage> {
    const chatMessage: ChatMessage = {
      chatId,
      content,
      sendAt: new Date(),
      userId,
    };
    return this.chatModel
      .findOneAndUpdate(
        {
          _id: chatId,
          members: {
            $elemMatch: {
              userId: userId,
            },
          },
        },
        {
          $push: { messages: { $each: [chatMessage], $sort: { sendAt: -1 } } },
        },
        { new: true }
      )
      .exec()
      .then((updatedChat) => {
        const sender = updatedChat.members.find(
          (m) => m.userId.toString() === userId
        );
        this.chatGateway.sendMessage(chatId, chatMessage, sender);
        return chatMessage;
      });
  }

  public async canSendMessageToChat(
    userId: string,
    chatId: string
  ): Promise<boolean> {
    return (
      (await this.chatModel
        .count({
          _id: chatId,
          members: {
            $elemMatch: { userId },
          },
        })
        .exec()) > 0
    );
  }

  public async isMemberOfChat(
    chatId: string,
    userId: string
  ): Promise<boolean> {
    const chat = await this.getOpenChatById(chatId);
    if (chat) {
      return chat.members.some((member) => member.userId == userId);
    }
    return false;
  }

  public getOpenChatById(chatId: string): Promise<ChatDocument> {
    return this.chatModel.findOne({ _id: chatId, closed: false }).exec();
  }

  public async canJoinTheChat(
    userId: string,
    chatId: string
  ): Promise<boolean> {
    const chat = await this.getOpenChatById(chatId);
    if (chat) {
      if (chat.creatorId.toString() === userId) {
        return true;
      }
      if (chat.members.some((member) => member.userId.toString() === userId)) {
        return true;
      }
    }
    return false;
  }

  public async isConnected(userId: string, chatId: string): Promise<boolean> {
    return (
      (await this.chatModel.count({
        _id: chatId,
        members: {
          $elemMatch: { userId: userId, status: WebsocketStatus.JOINED },
        },
      })) > 0
    );
  }

  public async getLastMessages(
    chatId: string,
    userId: string,
    time: Date
  ): Promise<ChatMessage[]> {
    const chat = await this.chatModel
      .findOne(
        {
          _id: chatId,
          closed: false,
          members: {
            $elemMatch: {
              userId: userId,
            },
          },
        },
        {
          messages: 1,
        }
      )
      .exec();
    return chat.messages
      .filter((m) => m.sendAt.getTime() < time.getTime())
      .slice(0, 10);
  }

  public async joinChat(chatId: string, userId: string): Promise<Chat> {
    const canJoin = await this.canJoinTheChat(userId, chatId);
    if (canJoin) {
      const user = await this.userService.findUserById(userId);
      return this.chatModel
        .findOneAndUpdate(
          {
            _id: chatId,
            closed: false,
            members: {
              $elemMatch: { userId: userId },
            },
          },
          {
            $set: {
              'members.$[element].status': WebsocketStatus.JOINED,
              'members.$[element].socketId': user.chatSocketId,
            },
          },
          {
            arrayFilters: [{ 'element.userId': userId }],
            new: true,
          }
        )
        .exec()
        .then((chat) => {
          if (chat) {
            const member = chat.members.find(
              (m) => m.userId.toString() === userId
            );
            this.chatGateway.joinChat(chat._id.toString(), member);
            return chat;
          }
        });
    } else {
      throw new ForbiddenException();
    }
  }

  public async getUserChatIds(userId: string): Promise<string[]> {
    return this.chatModel
      .find({
        members: {
          $elemMatch: {
            userId: userId,
          },
        },
      })
      .select('_id')
      .then((chats) => chats.map((chat) => chat._id.toString()));
  }
}
