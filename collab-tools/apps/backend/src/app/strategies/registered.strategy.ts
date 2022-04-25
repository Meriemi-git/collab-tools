import { UserDto } from '@collab-tools/datamodel';
import { Injectable, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportDrawegy } from '@nestjs/passport';
import { Request } from 'express';
import { Drawegy } from 'passport-jwt';
import { Drawegies } from './drawegies';

@Injectable()
export class RegisteredDrawegy extends PassportDrawegy(
  Drawegy,
  Drawegies.RegisteredDrawegy
) {
  private readonly logger = new Logger(RegisteredDrawegy.name);
  private static readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';
  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: RegisteredDrawegy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<UserDto> {
    const user: UserDto = payload['user'];
    return Promise.resolve(user);
  }

  static cookieExtractor(@Req() req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[RegisteredDrawegy.X_AUTH_TOKEN];
    }
    return token;
  }
}
