import { Room, UserDto } from '@collab-tools/datamodel';
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
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  public readonly X_ROOM_TOKEN: string = 'X_ROOM_TOKEN';
  constructor(
    private readonly roomService: RoomService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Post()
  public async createRoom(
    @Body('drawMapId') drawMapId: string,
    @Req() req: Request
  ): Promise<Room> {
    const userInfos: UserDto = this.jwtTokenService.getUserInfosRequest(req);
    return this.roomService.createRoom(userInfos, drawMapId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Get('all')
  public async getAllRooms(@Req() req: Request): Promise<Room[]> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.roomService.getAllRooms(userId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Get('own')
  public async getMyOpenRoom(@Req() req: Request): Promise<Room> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.roomService.getMyOwnRoom(ownerId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Post('invite/:roomId')
  public async inviteUsersToRoom(
    @Param('roomId') roomId: string,
    @Body('usernames') usernames: string[],
    @Req() req: Request
  ): Promise<Room> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.roomService.inviteUsers(roomId, usernames, ownerId);
  }

  @Patch('join/:roomId')
  public async joinRoom(
    @Param('roomId') roomId: string,
    @Req() req: Request
  ): Promise<Room> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.roomService.joinRoom(roomId, userId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Patch('leave/:roomId')
  public async leaveRoom(
    @Param('roomId') roomId: string,
    @Req() req: Request
  ): Promise<Room> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.roomService.leaveRoom(roomId, userId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Patch(':roomId/eject/:userId')
  public async ejectUserFromRoom(
    @Param('roomId') roomId: string,
    @Param('userId') userId: string,
    @Req() req: Request
  ): Promise<Room> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.roomService.ejectUserFromRoom(roomId, userId, ownerId);
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Patch('close')
  public async closeRoom(@Req() req: Request): Promise<Room> {
    const ownerId: string = this.jwtTokenService.getUserIdFromRequest(req);
    return this.roomService.closeRoom(ownerId);
  }
}
