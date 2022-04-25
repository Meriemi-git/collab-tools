import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  AttributeFilter,
  AuthInfos,
  PaginateResult,
  PasswordChangeWrapper,
  UserDto,
  UserPartialDto,
} from '@collab-tools/datamodel';
import { Request, Response } from 'express';
import { RateLimit } from 'nestjs-rate-limiter';
import { Strategies } from '../../strategies/strategies';
import { WebsocketStrategy } from '../../strategies/websocket.strategy';
import { JwtTokenService } from '../shared/jwt-token.service';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  private readonly logger = new Logger(UserController.name);
  private readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';
  private readonly X_REFRESH_TOKEN: string = 'X-REFRESH-TOKEN';
  constructor(
    private readonly userService: UserService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  @UseGuards(AuthGuard(Strategies.AdminStrategy))
  @Post('paginated')
  public async getUsersPaginated(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Body() userFilters: AttributeFilter,
    @Res() res: Response
  ): Promise<PaginateResult<UserDto>> {
    return this.userService
      .findUsersPaginated(limit, page, userFilters)
      .then((results) => {
        res.status(HttpStatus.OK).send(results);
        return Promise.resolve(results);
      });
  }

  @UseGuards(AuthGuard(Strategies.AdminStrategy))
  @Patch()
  public async update(
    @Body() user: UserDto,
    @Res() response: Response
  ): Promise<UserDto> {
    return this.userService
      .updateUserAndDisconnect(user)
      .then((updatedUser) => {
        response.status(HttpStatus.OK).send(updatedUser);
        return Promise.resolve(updatedUser);
      });
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Post('search')
  public async searchUsers(
    @Body('text') text: string,
    @Res() res: Response
  ): Promise<string[]> {
    return this.userService.searchUsers(text).then((results) => {
      res.status(HttpStatus.OK).send(results);
      return Promise.resolve(results);
    });
  }

  @UseGuards(AuthGuard(Strategies.RegisteredStrategy))
  @Patch('lang/:locale')
  public async changeLanguage(
    @Param('locale') locale: string,
    @Req() request: Request,
    @Res() response: Response
  ): Promise<UserDto> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(request);
    return this.userService
      .updateLangugage(userId, locale)
      .then((updatedUser) => {
        response
          .status(HttpStatus.OK)
          .send(this.userService.toDTO(updatedUser));
        return Promise.resolve(this.userService.toDTO(updatedUser));
      });
  }

  @UseGuards(AuthGuard(Strategies.AdminStrategy))
  @Delete(':id')
  public async delete(
    @Param('id') userId: string,
    @Res() response: Response
  ): Promise<any> {
    return this.userService.deleteUser(userId).then(() => {
      response.status(HttpStatus.OK).send();
      return Promise.resolve();
    });
  }

  @UseGuards(AuthGuard(Strategies.RegisteredStrategy))
  @Get('infos')
  public async infos(
    @Req() request: Request,
    @Res() response: Response
  ): Promise<UserDto> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(request);
    return this.userService.findUserById(userId).then((user) => {
      response.status(HttpStatus.OK).send(this.userService.toDTO(user));
      return Promise.resolve(this.userService.toDTO(user));
    });
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Get('likes')
  public async getLikes(
    @Req() request: Request,
    @Res() response: Response
  ): Promise<any> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(request);
    return this.userService.getLikesForUser(userId).then((likes) => {
      if (likes) {
        response.status(HttpStatus.OK).send(likes);
      } else {
        response.status(HttpStatus.FORBIDDEN).send();
      }
      return Promise.resolve();
    });
  }

  @RateLimit({
    keyPrefix: 'change-password',
    points: 1,
    duration: 300,
    errorMessage: 'Password cannot be changed more than once in per 5 minutes',
  })
  @UseGuards(AuthGuard(Strategies.RegisteredStrategy))
  @Post('change-password')
  public async changePassword(
    @Body() passwords: PasswordChangeWrapper,
    @Req() request: Request
  ): Promise<any> {
    const xRefreshToken = request.cookies[this.X_REFRESH_TOKEN];
    const xAuthToken = request.cookies[this.X_AUTH_TOKEN];
    return this.userService
      .changePassword(xAuthToken, xRefreshToken, passwords)
      .catch((error) => {
        throw error;
      });
  }

  @RateLimit({
    keyPrefix: 'change-mail',
    points: 1,
    duration: 300,
    errorMessage: 'Mail cannot be changed more than once in per 5 minutes',
  })
  @UseGuards(AuthGuard(Strategies.RegisteredStrategy))
  @Post('change-mail')
  public async changeMail(
    @Body() data,
    @Req() request: Request
  ): Promise<UserDto> {
    const xAuthToken = request.cookies[this.X_AUTH_TOKEN];
    return this.userService.changeMail(xAuthToken, data.newMail);
  }

  @Post('register')
  public async register(
    @Body() userDto: Partial<UserDto>,
    @Res() response: Response
  ): Promise<UserDto> {
    return this.userService.addUser(userDto).then((createdUser) => {
      this.userService.sendConfirmationMail(createdUser);
      return this.logIn(userDto, response);
    });
  }

  @RateLimit({
    keyPrefix: 'send-confirmation-mail',
    points: 1,
    duration: 300,
    errorMessage:
      'Confirmation mail cannot be sent more than once in per 5 minutes',
  })
  @Get('send-confirmation-mail')
  @UseGuards(AuthGuard(Strategies.RegisteredStrategy))
  public async sendConfirmationEmail(
    @Req() req: Request,
    @Res() response: Response
  ): Promise<UserDto> {
    const userId = this.jwtTokenService.getUserIdFromRequest(req);
    return this.userService.findUserById(userId).then((user) => {
      if (user) {
        return this.userService.sendConfirmationMail(user).then(() => {
          response.status(HttpStatus.OK).send(user);
          return Promise.resolve(user);
        });
      } else {
        throw new NotFoundException('No user found for sending email');
      }
    });
  }

  @Get('confirm/:token')
  public async confirm(@Param() param: any, @Res() response): Promise<any> {
    return this.userService
      .confirmEmailAddress(param.token)
      .then((confirmationSend) => {
        if (confirmationSend) {
          response.status(HttpStatus.OK).send();
        } else {
          throw new BadRequestException();
        }
      });
  }

  @Post('auth/login')
  public async login(
    @Body() userDto: UserPartialDto,
    @Res() response: Response
  ): Promise<UserDto> {
    return this.logIn(userDto, response);
  }

  @Get('auth/refresh')
  public async refreshToken(@Req() request, @Res() response): Promise<UserDto> {
    return this.userService
      .refresh(request)
      .then((authInfos) => {
        this.setAuthCookies(authInfos, response);
        response.status(HttpStatus.OK).send(authInfos.userDto);
        return Promise.resolve(authInfos.userDto);
      })
      .catch((error) => {
        response.clearCookie(this.X_AUTH_TOKEN);
        response.clearCookie(this.X_REFRESH_TOKEN);
        throw new UnauthorizedException();
      });
  }

  @Get('auth/disconnect')
  public async logout(@Req() request, @Res() response: Response): Promise<any> {
    try {
      this.jwtTokenService.invalidateTokens(request);
    } catch (error) {
      this.logger.error('Error during disconnecting user');
    } finally {
      response.clearCookie(this.X_AUTH_TOKEN);
      response.clearCookie(this.X_REFRESH_TOKEN);
      response.status(HttpStatus.OK).send();
    }
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Get('ws-access')
  public async getAccessToken(
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    const userId: string = this.jwtTokenService.getUserIdFromRequest(req);
    const payload = { userId };
    const token = this.jwtTokenService.getSignedToken(payload, '1d');
    this.setWSCookie(token, res);
    res.status(HttpStatus.OK).send();
  }

  private logIn(
    userDto: Partial<UserDto>,
    response: Response
  ): Promise<UserDto> {
    return this.userService.login(userDto).then((authInfos) => {
      this.setAuthCookies(authInfos, response);
      response.status(HttpStatus.OK).send(authInfos.userDto);
      return Promise.resolve(authInfos.userDto);
    });
  }

  private setWSCookie(token: string, response: Response) {
    response.cookie(WebsocketStrategy.X_WS_TOKEN, token, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000000,
    });
  }

  private setAuthCookies(authInfos: AuthInfos, response: Response) {
    response.cookie(this.X_AUTH_TOKEN, authInfos.authToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000000,
    });
    response.cookie(this.X_REFRESH_TOKEN, authInfos.refreshToken, {
      httpOnly: true,
      secure: true,
      maxAge: 3600000000,
    });
  }
}
