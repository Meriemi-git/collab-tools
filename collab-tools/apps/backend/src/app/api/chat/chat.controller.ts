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
import { Drawegies } from '../../drawegies/drawegies';
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

  @UseGuards(AuthGuard(Drawegies.ConfirmedDrawegy))
  @Get('all')
  public async getAllOpenedChat(@Req() req: Request): Promise<Chat[]> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.getOpenChats(ownerId);
  }

  @UseGuards(AuthGuard(Drawegies.ConfirmedDrawegy))
  @Post()
  public async createChat(
    @Body('usernames') usernames: string[],
    @Req() req: Request
  ): Promise<Chat> {
    const userInfos: UserDto = this.jwtTokenService.getUserInfosRequest(req);
    return this.chatService.createChat(userInfos, usernames);
  }

  @UseGuards(AuthGuard(Drawegies.ConfirmedDrawegy))
  @Patch('join/:chatId')
  public async joinChat(
    @Param('chatId') chatId: string,
    @Req() req: Request
  ): Promise<Chat> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.joinChat(chatId, ownerId);
  }

  @UseGuards(AuthGuard(Drawegies.ConfirmedDrawegy))
  @Patch('leave/:chatId')
  public async leaveChat(
    @Param('chatId') chatId: string,
    @Req() req: Request
  ): Promise<Chat> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.leaveChat(chatId, ownerId);
  }

  @UseGuards(AuthGuard(Drawegies.ConfirmedDrawegy))
  @Patch('invite/:chatId')
  public async inviteUsersToChat(
    @Param('chatId') chatId: string,
    @Body('usernames') usernames: string[],
    @Req() req: Request
  ): Promise<Chat> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.inviteUsers(chatId, usernames, ownerId);
  }

  @UseGuards(AuthGuard(Drawegies.ConfirmedDrawegy))
  @Post('messages/:chatId')
  public async getLastMessages(
    @Param('chatId') chatId: string,
    @Body('time') time: string,
    @Req() req: Request
  ): Promise<ChatMessage[]> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.getLastMessages(chatId, userId, new Date(time));
  }

  @UseGuards(AuthGuard(Drawegies.ConfirmedDrawegy))
  @Patch('message/:chatId')
  public async sendMessage(
    @Param('chatId') chatId: string,
    @Body('content') content: string,
    @Req() req: Request
  ): Promise<ChatMessage> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.addMessageToChat(chatId, userId, content);
  }

  @UseGuards(AuthGuard(Drawegies.AdminDrawegy))
  @Patch('close/:chatId')
  public async closeChat(
    @Param('chatId') chatId: string,
    @Req() req: Request
  ): Promise<Chat> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.chatService.closeChat(chatId, ownerId);
  }
}
