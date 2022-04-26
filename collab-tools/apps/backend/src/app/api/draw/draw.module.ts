import { DrawSchema } from '@collab-tools/datamodel';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from '../user/user.module';
import { DrawController } from './draw.controller';
import { DrawService } from './draw.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Draw', schema: DrawSchema }]),
    UserModule,
  ],
  controllers: [DrawController],
  providers: [DrawService],
  exports: [DrawService],
})
export class DrawModule {}
