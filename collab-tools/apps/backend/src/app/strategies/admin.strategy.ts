import { ForbiddenException, Injectable, Logger, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { UserDto, UserRole } from '@collab-tools/datamodel';
import { Request } from 'express';
import { Strategy } from 'passport-jwt';
import { Strategies } from './strategies';

@Injectable()
export class AdminStrategy extends PassportStrategy(
  Strategy,
  Strategies.AdminStrategy
) {
  private readonly logger = new Logger(AdminStrategy.name);

  private static readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';

  constructor(public readonly configService: ConfigService) {
    super({
      jwtFromRequest: AdminStrategy.cookieExtractor,
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
      token = req.cookies[AdminStrategy.X_AUTH_TOKEN];
    }
    return token;
  }
}
