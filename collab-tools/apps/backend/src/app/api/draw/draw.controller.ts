import { Draw, PaginateResult } from '@collab-tools/datamodel';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { Strategies } from '../../strategies/strategies';
import { JwtTokenService } from '../shared/jwt-token.service';
import { DrawService } from './draw.service';

@Controller('draws')
export class DrawController {
  private readonly logger = new Logger(DrawController.name);

  constructor(
    private readonly drawService: DrawService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  @Post('paginated')
  public async getDrawsPaginated(
    @Query('limit') limit: number,
    @Query('page') page: number,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<PaginateResult<Draw>> {
    const userId = this.jwtTokenService.getUserIdFromRequest(req);
    return this.drawService
      .findDrawsPaginated(limit, page, userId)
      .then((results) => {
        res.status(HttpStatus.OK).send(results);
        return results;
      });
  }

  @Get(':drawId')
  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  public async getById(
    @Param('drawId') drawId: string,
    @Req() request: Request,
    @Res() res: Response
  ): Promise<Draw> {
    const userIdFromCookies =
      this.jwtTokenService.getUserIdFromRequest(request);
    return this.drawService
      .findDrawById(userIdFromCookies, drawId)
      .then((draw) => {
        if (draw) {
          res.status(HttpStatus.OK).send(draw);
        } else {
          res.status(HttpStatus.NO_CONTENT);
        }
        return draw;
      });
  }

  @Post()
  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  public async adddraw(
    @Body() draw: Draw,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<Draw> {
    const userId = this.jwtTokenService.getUserIdFromRequest(req);
    draw.userId = userId;
    return this.drawService.addDraw(draw).then((added) => {
      res.status(HttpStatus.OK).send(added);
      return added;
    });
  }

  @Patch()
  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  public async updateDraw(
    @Body() draw: Draw,
    @Res() response: Response
  ): Promise<Draw> {
    return this.drawService.updateDraw(draw).then((updated) => {
      response.status(HttpStatus.OK).send(updated);
      return updated;
    });
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Delete(':drawId')
  public async deleteDraw(
    @Param('drawId') drawId: string,
    @Res() response: Response
  ): Promise<void> {
    this.drawService
      .deleteDraw(drawId)
      .then(() => response.status(HttpStatus.OK).send())
      .catch(() => response.status(HttpStatus.INTERNAL_SERVER_ERROR));
  }
}
