import { Chat, ChatMessage, UserDto } from '@collab-tools/datamodel';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { Strategies } from '../../strategies/strategies';
import { JwtTokenService } from '../shared/jwt-token.service';
import { ChatService } from './chat.service';
@Controller('chats')
export class ChatController {
  public readonly X_CHAT_TOKEN: string = 'X_CHAT_TOKEN';

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtTokenService: JwtTokenService,
    private readonly chatGateway: JwtTokenService
  ) {}

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Get('all')
  public async getAllOpenedChat(@Req() req: Request): Promise<Chat[]> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.getOpenChats(ownerId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Post()
  public async createChat(
    @Body('usernames') usernames: string[],
    @Req() req: Request
  ): Promise<Chat> {
    const userInfos: UserDto = this.jwtTokenService.getUserInfosRequest(req);
    return this.chatService.createChat(userInfos, usernames);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Patch('join/:chatId')
  public async joinChat(
    @Param('chatId') chatId: string,
    @Req() req: Request
  ): Promise<Chat> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.joinChat(chatId, ownerId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Patch('leave/:chatId')
  public async leaveChat(
    @Param('chatId') chatId: string,
    @Req() req: Request
  ): Promise<Chat> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.leaveChat(chatId, ownerId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Patch('invite/:chatId')
  public async inviteUsersToChat(
    @Param('chatId') chatId: string,
    @Body('usernames') usernames: string[],
    @Req() req: Request
  ): Promise<Chat> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.inviteUsers(chatId, usernames, ownerId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Post('messages/:chatId')
  public async getLastMessages(
    @Param('chatId') chatId: string,
    @Body('time') time: string,
    @Req() req: Request
  ): Promise<ChatMessage[]> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.getLastMessages(chatId, userId, new Date(time));
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Patch('message/:chatId')
  public async sendMessage(
    @Param('chatId') chatId: string,
    @Body('content') content: string,
    @Req() req: Request
  ): Promise<ChatMessage> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.addMessageToChat(chatId, userId, content);
  }
}
