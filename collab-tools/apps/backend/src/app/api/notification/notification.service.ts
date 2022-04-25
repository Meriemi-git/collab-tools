import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Notification,
  NotificationDocument,
  NotificationType,
} from '@collab-tools/datamodel';
import { Model } from 'mongoose';
import { NotificationGateway } from './notification.gateway';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<NotificationDocument>,
    private readonly notificationGateway: NotificationGateway
  ) {}

  public async getAllNotifications(userId: string): Promise<Notification[]> {
    return this.notificationModel.find({ userId }).exec();
  }

  public async deleteNotification(
    notificationId: string,
    userId: string
  ): Promise<void> {
    const removed = await this.notificationModel
      .findOneAndRemove({ _id: notificationId, userId })
      .exec();
    if (!removed) {
      throw new BadRequestException();
    }
  }

  public async sendNotification(
    userId: string,
    wsRoomId: string,
    socketId: string,
    type: NotificationType
  ) {
    const newNotification = await new this.notificationModel({
      userId,
      type,
      wsRoomId,
      createdAt: new Date(),
    }).save();
    if (type === NotificationType.CHAT_INVITATION) {
      this.notificationGateway.sendChatInvitationNotification(
        socketId,
        newNotification
      );
    } else if (type === NotificationType.ROOM_INVITATION) {
      this.notificationGateway.sendRoomInvitationNotification(
        socketId,
        newNotification
      );
    }
  }
}
