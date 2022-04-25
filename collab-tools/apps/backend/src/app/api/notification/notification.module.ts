import { NotificationSchema } from '@collab-tools/datamodel';
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketDrawegy } from '../../drawegies/websocket.drawegy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notification.gateway';
import { NotificationService } from './notification.service';
@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    SharedModule,
    UserModule,
  ],
  controllers: [NotificationController],
  providers: [NotificationGateway, NotificationService, WebsocketDrawegy],
  exports: [NotificationService],
})
export class NotificationModule {}
