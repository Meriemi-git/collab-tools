import {
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Notification } from '@collab-tools/datamodel';
import { Request } from 'express';
import { Strategies } from '../../strategies/strategies';
import { JwtTokenService } from '../shared/jwt-token.service';
import { NotificationService } from './notification.service';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

  constructor(
    private readonly notificationService: NotificationService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  @UseGuards(AuthGuard(Strategies.RegisteredStrategy))
  @Get()
  public getNotifications(@Req() request: Request): Promise<Notification[]> {
    const userId = this.jwtTokenService.getUserIdFromRequest(request);
    return this.notificationService.getAllNotifications(userId);
  }

  @UseGuards(AuthGuard(Strategies.RegisteredStrategy))
  @Delete(':id')
  public deleteNotification(
    @Param('id') id: string,
    @Req() request: Request
  ): Promise<void> {
    const userId = this.jwtTokenService.getUserIdFromRequest(request);
    return this.notificationService.deleteNotification(id, userId);
  }
}
