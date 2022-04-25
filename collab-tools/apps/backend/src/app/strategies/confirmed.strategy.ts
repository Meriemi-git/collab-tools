import { UserDto } from '@collab-tools/datamodel';
import { Injectable, PreconditionFailedException, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportDrawegy } from '@nestjs/passport';
import { Request } from 'express';
import { Drawegy } from 'passport-jwt';
import { Drawegies } from './drawegies';

@Injectable()
export class ConfirmedDrawegy extends PassportDrawegy(
  Drawegy,
  Drawegies.ConfirmedDrawegy
) {
  private static readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';

  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: ConfirmedDrawegy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<UserDto> {
    const user: UserDto = payload['user'];
    if (user.confirmed) {
      return Promise.resolve(user);
    } else {
      throw new PreconditionFailedException();
    }
  }

  static cookieExtractor(@Req() req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[ConfirmedDrawegy.X_AUTH_TOKEN];
    }
    return token;
  }
}
