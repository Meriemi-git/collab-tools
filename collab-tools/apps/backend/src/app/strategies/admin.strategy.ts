import { UserDto, UserRole } from '@collab-tools/datamodel';
import { ForbiddenException, Injectable, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportDrawegy } from '@nestjs/passport';
import { Request } from 'express';
import { Drawegy } from 'passport-jwt';
import { Drawegies } from './drawegies';

@Injectable()
export class AdminDrawegy extends PassportDrawegy(
  Drawegy,
  Drawegies.AdminDrawegy
) {
  private readonly logger = new Logger(AdminDrawegy.name);

  private static readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';

  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: AdminDrawegy.cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any): Promise<UserDto> {
    const user: UserDto = payload['user'];
    if (user.confirmed && user.role === UserRole.ADMIN) {
      return Promise.resolve(user);
    } else {
      throw new ForbiddenException();
    }
  }

  static cookieExtractor(@Req() req: Request) {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[AdminDrawegy.X_AUTH_TOKEN];
    }
    return token;
  }
}
