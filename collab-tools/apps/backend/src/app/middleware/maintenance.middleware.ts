import {
  Injectable,
  Logger,
  NestMiddleware,
  Req,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class MaintenanceMiddleware implements NestMiddleware {
  private readonly MAINTENANCE_MODE_ON: string;
  private readonly logger = new Logger(MaintenanceMiddleware.name);

  constructor(private readonly configService: ConfigService) {
    this.MAINTENANCE_MODE_ON = this.configService.get<string>(
      'MAINTENANCE_MODE_ON'
    );
  }
  use(@Req() req: Request, res: Response, next: NextFunction) {
    this.logger.debug(req.originalUrl);
    if (this.MAINTENANCE_MODE_ON === 'true') {
      throw new ServiceUnavailableException('Website is under maintenance');
    } else {
      next();
    }
  }
}
