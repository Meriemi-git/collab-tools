import { RoomSchema } from '@collab-tools/datamodel';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketDrawegy } from '../../drawegies/websocket.drawegy';
import { SharedModule } from '../shared/shared.module';
import { UserModule } from '../user/user.module';
import { RoomController } from './room.controller';
import { RoomGateway } from './room.gateway';
import { RoomService } from './room.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Room', schema: RoomSchema }]),
    UserModule,
    SharedModule,
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomGateway, WebsocketDrawegy],
  exports: [RoomService],
})
export class RoomModule {}
