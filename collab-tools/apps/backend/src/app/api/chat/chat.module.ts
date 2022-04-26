import { ChatSchema } from '@collab-tools/datamodel';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketStrategy } from '../../strategies/websocket.strategy';
import { NotificationModule } from '../notification/notification.module';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Chat', schema: ChatSchema }]),
    UserModule,
    SharedModule,
    NotificationModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway, WebsocketStrategy],
  exports: [ChatService],
})
export class ChatModule {}
