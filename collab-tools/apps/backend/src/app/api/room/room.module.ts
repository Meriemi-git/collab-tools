import { RoomSchema } from '@collab-tools/datamodel';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WebsocketStrategy } from '../../strategies/websocket.strategy';
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
  providers: [RoomService, RoomGateway, WebsocketStrategy],
  exports: [RoomService],
})
export class RoomModule {}
