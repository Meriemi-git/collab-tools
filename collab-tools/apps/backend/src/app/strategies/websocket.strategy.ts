import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportDrawegy } from '@nestjs/passport';
import { Request } from 'express';
import { Drawegy } from 'passport-jwt';
import { CookieParser } from '../utils/cookie-parser';
import { Drawegies } from './drawegies';

@Injectable()
export class WebsocketDrawegy extends PassportDrawegy(
  Drawegy,
  Drawegies.WebsocketDrawegy
) {
  public static readonly X_WS_TOKEN: string = 'X-WS-TOKEN';
  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: WebsocketDrawegy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: unknown): Promise<boolean> {
    const userId: string = payload['userId'];
    if (userId) {
      return Promise.resolve(true);
    } else {
      throw new UnauthorizedException();
    }
  }

  static cookieExtractor(@Req() req: any) {
    let token = null;
    if (req?.handshake?.headers?.cookie) {
      token = CookieParser.GetCookieValue(
        WebsocketDrawegy.X_WS_TOKEN,
        req?.handshake?.headers?.cookie
      );
    }
    return token;
  }
}
