import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { AppModule } from './app/app.module';
import { RedisIoAdapter } from './app/ws/redis-io-adapter-2';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const config = app.get(ConfigService);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);
  app.use(cookieParser());
  app.use(compression());
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const port = config.get('PORT') || 3333;

  // const csrfProtection = csurf({
  //   cookie: {
  //     secure: true,
  //   },
  // });

  app.use(function (err, req: Request, res: Response, next) {
    if (err.code !== 'EBADCSRFTOKEN') {
      return next(err);
    } else {
      res.status(403);
      res.send('XSRF Error');
      logger.log(`XSRF Error`);
    }
  });

  // app.use(csrfProtection, (req, res, next): void => {
  //   res.cookie('XSRF-TOKEN', req.csrfToken(), {
  //     httpOnly: false,
  //     ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  //   });
  //   next();
  // });
  const logger: Logger = app.get(WINSTON_MODULE_NEST_PROVIDER);
  await app.listen(port, () => {
    logger.log(`Listening at http://localhost:${port}/${globalPrefix}`);
    logger.log(`Running in ${config.get('NODE_ENV')}`);
  });
}

bootstrap();
