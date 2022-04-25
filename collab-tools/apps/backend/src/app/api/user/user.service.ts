import {
  AttributeFilter,
  AuthInfos,
  Like,
  LikeDocument,
  MailConfirmationToken,
  PaginateResult,
  PasswordChangeWrapper,
  TokenExpiredError,
  User,
  UserDocument,
  UserDto,
} from '@collab-tools/datamodel';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Request } from 'express';
import { FilterQuery, PaginateModel, PaginateOptions } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { FiltersService } from '../shared/filters.service';
import { JwtTokenService } from '../shared/jwt-token.service';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);
  private readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';
  private readonly X_REFRESH_TOKEN: string = 'X-REFRESH-TOKEN';
  constructor(
    @InjectModel('User')
    private readonly userModel: PaginateModel<UserDocument>,
    @InjectModel('Like')
    private readonly likeModel: PaginateModel<LikeDocument>,
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
    private readonly filtersService: FiltersService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  public findUsersPaginated(
    limit: number,
    page: number,
    userFilter: AttributeFilter
  ): Promise<PaginateResult<UserDto>> {
    const options: PaginateOptions = {
      limit: limit,
      page: page,
      sort: { [userFilter.sortedBy]: userFilter.order },
      select: {
        _id: 1,
        username: 1,
        mail: 1,
        confirmed: 1,
        cguAgreementDate: 1,
        role: 1,
        liked: 1,
      },
    };
    const query: FilterQuery<UserDocument> = {};
    userFilter.filters.forEach((filterMetadata) => {
      if (!filterMetadata.aggregated) {
        this.filtersService.applyFilterToQuery(
          query,
          filterMetadata,
          this.userModel.schema
        );
      }
    });
    return this.userModel.paginate(query, options);
  }

  public async searchUsers(text: string): Promise<string[]> {
    const regex = `^${text.toLocaleLowerCase()}.*`;
    return (
      await this.userModel
        .find(
          { normalized_username: { $regex: regex, $options: 'i' } },
          { username: 1 }
        )
        .collation({ locale: 'en', strength: 1 })
        .exec()
    ).map((users) => users.username);
  }

  public async getLikesForUser(userId: string): Promise<Like[]> {
    return this.likeModel.find({ userId: userId }).exec();
  }

  public async updateUserAndDisconnect(user: UserDto): Promise<UserDto> {
    return this.userModel
      .findByIdAndUpdate(user._id, user, {
        new: true,
      })
      .exec()
      .then((updated) => {
        this.jwtTokenService.revokeRefreshTokenByUserId(updated.id);
        return this.toDTO(updated);
      });
  }

  public async updateLangugage(userId: string, locale: string) {
    return this.userModel.findByIdAndUpdate(
      { _id: userId },
      { locale },
      {
        new: true,
      }
    );
  }

  public async deleteUser(userId: string): Promise<void> {
    this.userModel.deleteOne({ _id: userId }).exec();
  }

  public async findByMail(mail: string): Promise<User> {
    return this.userModel.findOne({ mail: mail }).exec();
  }

  public async mailExists(mail: string): Promise<boolean> {
    return (await this.userModel.count({ mail: mail })) > 0;
  }

  public async usernameExists(username: string): Promise<boolean> {
    return this.userModel
      .findOne({ normalized_username: username.toLocaleLowerCase() })
      .collation({ locale: 'en', strength: 1 })
      .then((user) => user !== null);
  }

  public findUserById(userId: string): Promise<User> {
    return this.userModel.findById(userId).exec();
  }

  public async changePassword(
    xAuthToken: string,
    xRefreshToken: string,
    passwords: PasswordChangeWrapper
  ): Promise<UserDto> {
    try {
      const authToken = this.jwtTokenService.decodeToken(xAuthToken);
      const user = await this.userModel
        .findOne({
          _id: authToken['userId'],
          refreshToken: xRefreshToken,
        })
        .exec();
      if (user) {
        const pwdMatch = await bcrypt.compare(
          passwords.oldPassword,
          user.password
        );
        if (pwdMatch) {
          user.password = passwords.newPassword;
          return user
            .save()
            .then((updated) => {
              return this.toDTO(updated);
            })
            .catch(() => {
              this.logger.error('Error during update password');
              throw new HttpException('Error during update password', 466);
            });
        } else {
          throw new HttpException('Incorrect old password', 467);
        }
      } else {
        this.logger.error('User not found');
        throw new ForbiddenException();
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException();
      } else {
        throw new ForbiddenException();
      }
    }
  }

  public async userExists(userId: string): Promise<boolean> {
    return (await this.userModel.count({ _id: userId })) > 0;
  }

  public async changeMail(
    xAuthToken: unknown,
    newMail: string
  ): Promise<UserDto> {
    try {
      const authToken = this.jwtTokenService.decodeToken(xAuthToken);
      const userDto: UserDto = authToken['user'];
      const mailExists = await this.userModel.exists({ mail: newMail });
      if (mailExists) {
        throw new HttpException('Mail already taken', 468);
      } else {
        const user = await this.userModel
          .findOne({
            _id: userDto._id,
          })
          .exec();
        if (user) {
          if (user.mail !== newMail) {
            user.mail = newMail;
            user.confirmed = false;
            return this.sendConfirmationMail(user)
              .then(() => {
                user.mail = newMail;
                user.confirmed = false;
                return user
                  .save()
                  .then((updated) => {
                    return this.toDTO(updated);
                  })
                  .catch(() => {
                    this.logger.error('Error during update mail');
                    throw new InternalServerErrorException();
                  });
              })
              .catch(() => {
                this.logger.error('Error during sending confirmation');
                throw new HttpException(
                  'Error during sending confirmation',
                  466
                );
              });
          } else {
            this.logger.debug('Mail is not different');
            throw new HttpException('Mail is the same as before', 467);
          }
        } else {
          this.logger.debug('User not found');
          throw new ForbiddenException();
        }
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException();
      } else {
        throw error;
      }
    }
  }

  public async addUser(userDto: Partial<UserDto>): Promise<UserDto> {
    const mailExists = await this.mailExists(userDto.mail);
    if (mailExists) {
      throw new HttpException('Mail already exists', 467);
    }
    const usernameExists = await this.usernameExists(userDto.username);
    if (usernameExists) {
      throw new HttpException('Username already Exists', 468);
    }
    if (!userDto.cguAgreement) {
      throw new HttpException("User didn't aggree CGU's", 469);
    }
    const newUser = new this.userModel(userDto);
    newUser.cguAcceptedAt = new Date();
    return newUser
      .save()
      .then((created) => {
        return this.toDTO(created);
      })
      .catch((error) => {
        this.logger.debug(`Error when saving user`, error);
        throw new HttpException(`Error when saving user`, 466);
      });
  }

  public async confirmEmailAddress(token: string): Promise<boolean> {
    try {
      const payload = this.jwtTokenService.decodeToken(token);
      const mail = payload['mail'];
      const id = payload['id'];
      if (payload) {
        const user = await this.userModel
          .findOne({ mail: mail, _id: id })
          .exec();

        if (user) {
          if (user.confirmed) {
            throw new HttpException('Email address already confirmed', 469);
          } else {
            this.userModel.updateOne({ _id: id }, { confirmed: true }).exec();
            return true;
          }
        } else {
          this.logger.error('Error during email confirmation');
          throw new HttpException('Error during email confirmation', 466);
        }
      } else {
        this.logger.error('Error during decoding mail confirmation token');
        throw new HttpException('Error during decoding token', 467);
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new HttpException('Error during decoding token', 468);
      } else {
        throw new ForbiddenException();
      }
    }
  }

  public async sendConfirmationMail(user: UserDto): Promise<void> {
    const payload: MailConfirmationToken = { mail: user.mail, id: user._id };
    const token = this.jwtTokenService.getSignedToken(payload, '30m');
    const link = `${this.configService.get('CONFIRM_URL')}/${token}`;
    const locale = user.locale == null ? 'en' : user.locale;
    const maiConf = {
      to: user.mail, // list of receivers
      from: this.configService.get('SMTP_MAIL'), // sender address
      subject: 'Draw Editor confirmation', // Subject line
      template: `${this.configService.get(
        'TEMPLATES_FOLDER'
      )}/confirmation-${locale}.hbs`,
      context: {
        username: user.username,
        link: link,
      },
    };
    return await this.mailerService.sendMail(maiConf).catch((error) => {
      this.logger.error('Error during confirmation mail sending', error);
      throw new HttpException('Error during confirmation mail sending', 466);
    });
  }

  public async login(userDto: Partial<UserDto>): Promise<AuthInfos> {
    return this.validateUser(userDto).then((user) =>
      this.generateTokenAndRefreshToken(user)
    );
  }

  public async validateUser(userDto: Partial<UserDto>): Promise<User> {
    let matchingUser: User;
    if (userDto.mail) {
      matchingUser = await this.findByMail(userDto.mail.toLocaleLowerCase());
    } else if (userDto.username) {
      matchingUser = await this.findByUsername(userDto.username);
    }
    if (matchingUser) {
      try {
        const pwdMatch = await bcrypt.compare(
          userDto.password,
          matchingUser.password
        );
        if (pwdMatch) {
          return Promise.resolve(matchingUser);
        } else {
          throw new ForbiddenException();
        }
      } catch (error) {
        this.logger.debug('Error during decoding password');
        throw new ForbiddenException();
      }
    } else {
      throw new ForbiddenException();
    }
  }
  public async findByUsername(username: string): Promise<User> {
    return this.userModel.findOne({
      normalized_username: username.toLocaleLowerCase(),
    });
  }

  public async refresh(request: Request): Promise<AuthInfos> {
    const xAuthToken = request.cookies[this.X_AUTH_TOKEN];
    const xRefreshToken = request.cookies[this.X_REFRESH_TOKEN];
    try {
      const authToken = this.jwtTokenService.decodeToken(xAuthToken, true);
      const refreshToken = this.jwtTokenService.decodeToken(xRefreshToken);
      if (authToken['jti'] === refreshToken['jti']) {
        const userId = refreshToken['userId'];
        const user = await this.findUserById(userId);
        if (user) {
          const isValid = await this.jwtTokenService.isRefreshTokenValid(
            refreshToken['_id']
          );
          if (isValid) {
            const xAuthTokenNew = this.jwtTokenService.generateAuthToken(
              user,
              refreshToken['jti']
            );
            const authInfos = this.createAuthInfos(
              xAuthTokenNew,
              xRefreshToken,
              user
            );
            return Promise.resolve(authInfos);
          } else {
            this.logger.debug('RefreshToken is not valid');
            throw new UnauthorizedException();
          }
        } else {
          this.logger.debug('User nor found');
          throw new UnauthorizedException();
        }
      } else {
        this.logger.debug('Auth and Refresh tokens are not paired');
        throw new ForbiddenException();
      }
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        const refreshToken = this.jwtTokenService.decodeToken(
          request.cookies[this.X_REFRESH_TOKEN],
          true
        );
        this.jwtTokenService.revokeRefreshTokenById(refreshToken['_id']);
      }
      throw new ForbiddenException();
    }
  }

  private async generateTokenAndRefreshToken(user: User): Promise<AuthInfos> {
    const jwtId = uuid().toString();
    return this.jwtTokenService
      .generateRefreshToken(user, jwtId)
      .then((refreshTokenEncrypted) => {
        const authTokenEncrypted = this.jwtTokenService.generateAuthToken(
          this.toDTO(user),
          jwtId
        );
        return {
          userDto: this.toDTO(user),
          authToken: authTokenEncrypted,
          refreshToken: refreshTokenEncrypted,
        } as AuthInfos;
      });
  }

  public createAuthInfos(
    authToken: string,
    refreshToken: string,
    user: User
  ): AuthInfos {
    return {
      authToken: authToken,
      refreshToken: refreshToken,
      userDto: this.toDTO(user),
    } as AuthInfos;
  }

  public addLikedDraw(userId: string, drawId: string): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { _id: userId, liked: { $nin: [drawId] } },
        { $push: { liked: drawId } },
        { new: true }
      )
      .exec();
  }

  public removeLikedDraw(userId: string, drawId: string): Promise<User> {
    return this.userModel
      .findOneAndUpdate(
        { _id: userId, liked: { $in: [drawId] } },
        { $pull: { liked: { $in: [drawId] } } },
        { new: true }
      )
      .exec();
  }

  public setRoomSocketId(userId: string, roomSocketId: string): Promise<User> {
    return this.userModel
      .findOneAndUpdate({ _id: userId }, { roomSocketId }, { new: true })
      .exec();
  }

  public setChatSocketId(userId: string, chatSocketId: string) {
    return this.userModel
      .findOneAndUpdate({ _id: userId }, { chatSocketId }, { new: true })
      .exec();
  }

  public setNotificationSocketId(
    userId: unknown,
    notificationSocketId: string
  ) {
    return this.userModel
      .findOneAndUpdate(
        { _id: userId },
        { notificationSocketId },
        { new: true }
      )
      .exec();
  }

  public toDTO(user: User): UserDto {
    return {
      _id: user._id,
      confirmed: user.confirmed,
      mail: user.mail,
      locale: user.locale,
      cguAcceptedAt: user.cguAcceptedAt,
      username: user.username,
      role: user.role,
    } as UserDto;
  }

  public getUsersByUsernames(usernames: string[]): Promise<User[]> {
    if (usernames == null || usernames.length === 0) {
      return Promise.resolve([]);
    }
    const myset = [...new Set(usernames)];
    return this.userModel.find({ username: { $in: myset } }).exec();
  }
}
