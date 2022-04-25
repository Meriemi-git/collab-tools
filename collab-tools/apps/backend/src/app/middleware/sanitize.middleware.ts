import { Injectable, NestMiddleware, Req } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as mongoose_sanitize from 'mongo-sanitize';

@Injectable()
export class SanitizeMiddleware implements NestMiddleware {
  use(@Req() req: Request, res: Response, next: NextFunction) {
    req.body = mongoose_sanitize(req.body);
    next();
  }
}
