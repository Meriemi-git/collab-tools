import { Injectable, Logger } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import {
  PairedTokens,
  RefreshToken,
  RefreshTokenDocument,
  TokenExpiredError,
  TokenInvalidError,
  User,
  UserDto,
} from '@collab-tools/datamodel';
import { Request } from 'express';
import { Model } from 'mongoose';

@Injectable()
export class JwtTokenService {
  tryGetUserFromTokens(xAuthToken: string, xRefreshToken: string): UserDto {
    try {
      const authToken = this.decodeToken(xAuthToken, true);
      const refreshToken = this.decodeToken(xRefreshToken);
      if (authToken['jti'] === refreshToken['jti']) {
        return authToken['user'];
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }
  private readonly logger = new Logger(JwtTokenService.name);
  private readonly X_AUTH_TOKEN_EXIPRATION = '5m';
  private readonly X_REFRESH_TOKEN_EXIPRATION = '1d';
  private readonly X_AUTH_TOKEN = 'X-AUTH-TOKEN';
  private readonly X_REFRESH_TOKEN = 'X-REFRESH-TOKEN';
  private readonly TOKEN_EXPIRATION_ERROR_NAME = 'TokenExpiredError';
  private readonly TOKEN_INVALID_ERROR_NAME = 'TokenInvalidError';

  constructor(
    @InjectModel('RefreshToken')
    private readonly refreshTokenModel: Model<RefreshTokenDocument>,
    private readonly jwtService: JwtService
  ) {}

  public getSignedToken(payload: any, expiresIn: string): string {
    const signOptions: JwtSignOptions = {
      expiresIn: expiresIn,
    };
    return this.jwtService.sign(payload, signOptions);
  }

  public decodeToken(payload: any, ignoreExpiration = false): unknown {
    const signOptions: JwtVerifyOptions = {
      ignoreExpiration: ignoreExpiration,
    };
    try {
      return this.jwtService.verify(payload, signOptions);
    } catch (error) {
      if (error.name === this.TOKEN_EXPIRATION_ERROR_NAME) {
        throw new TokenExpiredError(this.TOKEN_EXPIRATION_ERROR_NAME);
      } else {
        throw new TokenInvalidError(this.TOKEN_INVALID_ERROR_NAME);
      }
    }
  }

  public isRefreshTokenValid(refreshTokenId: string): Promise<boolean> {
    return this.refreshTokenModel
      .findOne({ _id: refreshTokenId })
      .exec()
      .then((entry) => {
        return entry != null;
      });
  }

  public refreshTokens(
    xAuthToken: string,
    xRefreshToken: string
  ): PairedTokens {
    try {
      const authToken = this.jwtService.decode(xAuthToken);
      const refreshToken = this.jwtService.verify(xRefreshToken);
      if (authToken['jti'] === refreshToken['jti']) {
        return {
          userDto: authToken['user'],
          refreshToken: {
            _id: refreshToken['_id'],
            userId: refreshToken['userId'],
            creationDate: refreshToken['creationDate'],
          },
          jwtId: authToken['jti'],
        };
      } else {
        this.logger.debug('Tokens were not paired');
        return null;
      }
    } catch (error) {
      this.logger.debug('Tokens were invalid');
      const refreshToken = this.jwtService.decode(xRefreshToken);
      if (refreshToken) {
        this.revokeRefreshTokenById(refreshToken['_id']);
      }
      return null;
    }
  }

  public revokeRefreshTokenById(refreshTokenId: string): Promise<any> {
    this.logger.debug('Revokation of refrehToken');
    return this.refreshTokenModel
      .findOneAndDelete({ _id: refreshTokenId })
      .exec();
  }

  public revokeRefreshTokenByUserId(userId: string): Promise<any> {
    this.logger.debug('Revokation of refrehToken');
    return this.refreshTokenModel.deleteMany({ userId: userId }).exec();
  }

  public generateAuthToken(userDto: UserDto, jwtId: string): string {
    const payload = { user: userDto };
    return this.jwtService.sign(payload, {
      jwtid: jwtId,
      expiresIn: this.X_AUTH_TOKEN_EXIPRATION,
    });
  }

  public async generateRefreshToken(
    user: User,
    jwtUid: string
  ): Promise<string> {
    const payload: RefreshToken = {
      userId: user._id,
      creationDate: new Date(),
    };
    const createdRefreshToken = new this.refreshTokenModel(payload);
    return createdRefreshToken.save().then((refreshToken) => {
      payload._id = refreshToken._id;
      return this.jwtService.sign(payload, {
        jwtid: jwtUid,
        expiresIn: this.X_REFRESH_TOKEN_EXIPRATION,
      });
    });
  }

  public invalidateTokens(request: any) {
    const refreshToken = this.jwtService.decode(
      request.cookies[this.X_REFRESH_TOKEN]
    );
    if (refreshToken) {
      this.revokeRefreshTokenById(refreshToken['_id']);
    }
  }

  public getUserIdFromRequest(request: Request): string {
    const xAuthToken = request.cookies[this.X_AUTH_TOKEN];
    if (xAuthToken) {
      try {
        const jwtInfos = this.jwtService.decode(xAuthToken);
        return jwtInfos['user']._id;
      } catch (error) {
        this.logger.debug('Error in getUserIdFromCookies');
        return null;
      }
    }
    return null;
  }

  public getUserInfosRequest(request: Request): UserDto {
    const xAuthToken = request.cookies[this.X_AUTH_TOKEN];
    if (xAuthToken) {
      try {
        const jwtInfos = this.jwtService.decode(xAuthToken);
        return jwtInfos['user'];
      } catch (error) {
        this.logger.debug('Error in getUserIdFromCookies');
        return null;
      }
    }
    return null;
  }

  public getUserIdFromHeaders(headers: unknown): string {
    const xAuthToken = headers[this.X_AUTH_TOKEN];
    try {
      const jwtInfos = this.jwtService.verify(xAuthToken);
      return jwtInfos['user']?._id;
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
