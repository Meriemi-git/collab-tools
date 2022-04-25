import {
  Global,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import * as winston from 'winston';
import * as Transport from 'winston-transport';
import { ChatModule } from './api/chat/chat.module';
import { GalleryModule } from './api/gallery/gallery.module';
import { NotificationModule } from './api/notification/notification.module';
import { RoomModule } from './api/room/room.module';
import { SharedModule } from './api/shared/shared.module';
import { UserModule } from './api/user/user.module';
import { configuration } from './config/configuration';
import { validationSchema } from './config/validation';
import { MaintenanceMiddleware } from './middleware/maintenance.middleware';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.config/.env',
      load: [configuration],
      validationSchema: validationSchema,
    }),
    WinstonModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        level: configService.get<string>('LOG_LEVEL'),
        transports: createWinstonTransport(
          configService.get<string>('NODE_ENV')
        ),
      }),
    }),
    MongooseModule.forRoot('mongodb://localhost:27017/collab-tools', {}),
    UserModule,
    GalleryModule,
    RateLimiterModule,
    SharedModule,
    NotificationModule,
    RoomModule,
    ChatModule,
  ],
  exports: [ConfigModule],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(MaintenanceMiddleware)
      //.forRoutes('*')
      //.apply(SanitizeMiddleware)
      .forRoutes(
        { path: '*', method: RequestMethod.POST },
        { path: '*', method: RequestMethod.PATCH },
        { path: '*', method: RequestMethod.PUT }
      );
  }
}

function createWinstonTransport(env: string): Transport[] {
  const transports: Transport[] = [];
  if (env === 'development') {
    const consoleTranssport = new winston.transports.Console({
      format: winston.format.simple(),
    });
    transports.push(consoleTranssport);
  }
  const errorTransport = new winston.transports.File({
    filename: '.logs/error.log',
    level: 'error',
  });
  transports.push(errorTransport);
  const combinedTransport = new winston.transports.File({
    filename: '.logs/combined.log',
  });
  transports.push(combinedTransport);
  return transports;
}
