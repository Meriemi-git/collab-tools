import { Injectable, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto } from '@collab-tools/datamodel';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { Strategies } from './strategies';

@Injectable()
export class RegisteredStrategy extends PassportStrategy(
  Strategy,
  Strategies.RegisteredStrategy
) {
  private readonly logger = new Logger(RegisteredStrategy.name);
  private static readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';
  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: RegisteredStrategy.cookieExtractor,
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
      token = req.cookies[RegisteredStrategy.X_AUTH_TOKEN];
    }
    return token;
  }
}
