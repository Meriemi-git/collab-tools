import { ImageSchema } from '@collab-tools/datamodel';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { MulterSharpWithThumb } from '../../storage/multer-sharp-with-thumb';
import { imageFileFilter } from '../../utils/file-upload.utils';
import { GalleryController } from './gallery.controller';
import { GalleryService } from './gallery.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Image', schema: ImageSchema }]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: new MulterSharpWithThumb(
          `${configService.get('UPLOAD_FOLDER')}/${configService.get(
            'IMAGES_FOLDER'
          )}`,
          `${configService.get('UPLOAD_FOLDER')}/${configService.get(
            'THUMBS_FOLDER'
          )}`,
          'webp'
        ),
        limits: { fileSize: 5 * 1024 * 1024, files: 1 },
        fileFilter: imageFileFilter,
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [GalleryController],
  providers: [GalleryService],
  exports: [GalleryService],
})
export class GalleryModule {}
