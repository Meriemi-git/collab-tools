import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationSchema } from '@collab-tools/datamodel';
import { WebsocketStrategy } from '../../strategies/websocket.strategy';
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
  providers: [NotificationGateway, NotificationService, WebsocketStrategy],
  exports: [NotificationService],
})
export class NotificationModule {}
