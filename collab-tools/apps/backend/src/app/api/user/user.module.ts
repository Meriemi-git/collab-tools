import { LikeSchema, UserSchema } from '@collab-tools/datamodel';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { RateLimiterModule } from 'nestjs-rate-limiter';
import { ConfirmedStrategy } from '../../strategies/confirmed.strategy';
import { RegisteredStrategy } from '../../strategies/registered.strategy';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Like', schema: LikeSchema }]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: `smtps://${configService.get(
          'SMTP_MAIL'
        )}:${configService.get('SMTP_PWD')}@${configService.get('SMTP_HOST')}`,
        defaults: {
          from: '"nest-modules" <modules@nestjs.com>',
        },
        template: {
          dir: configService.get('TEMPLATES_FOLDER'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
    RateLimiterModule.register({}),
  ],
  controllers: [UserController],
  providers: [UserService, ConfirmedStrategy, RegisteredStrategy],
  exports: [UserService],
})
export class UserModule {}
