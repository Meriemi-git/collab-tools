import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { CookieParser } from '../utils/cookie-parser';
import { Strategies } from './strategies';

@Injectable()
export class WebsocketStrategy extends PassportStrategy(
  Strategy,
  Strategies.WebsocketStrategy
) {
  public static readonly X_WS_TOKEN: string = 'X-WS-TOKEN';
  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: WebsocketStrategy.cookieExtractor,
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
        WebsocketStrategy.X_WS_TOKEN,
        req?.handshake?.headers?.cookie
      );
    }
    return token;
  }
}
