import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createMulterOptions(): MulterModuleOptions {
    return {
      dest: this.configService.get('UPLOAD_FOLDER'),
    };
  }
}
