import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { StorageEngine } from 'multer';
import * as sharp from 'sharp';
import { v4 as uuid } from 'uuid';

export class MulterSharp implements StorageEngine {
  private readonly logger = new Logger(MulterSharp.name);

  public imagesPath: string;
  public format: 'png' | 'jpeg' | 'webp';
  public compression: boolean;
  constructor(
    imagesPath: string,
    format: 'png' | 'jpeg' | 'webp',
    compression = true
  ) {
    this.imagesPath = imagesPath;
    this.format = format;
    this.compression = compression;
  }
  _handleFile(req, file: Express.Multer.File, cb) {
    const filename = `${uuid()}.${this.format}`;
    const imageFullPath = `${this.imagesPath}/${filename}`;

    fs.access(this.imagesPath, fs.constants.W_OK, (err) => {
      if (err) {
        fs.mkdirSync(this.imagesPath, fs.constants.W_OK);
      }
      if (this.compression) {
        // Convert image
        const imageStream = sharp();
        file.stream.pipe(imageStream);
        const imagePromise = imageStream
          .toFormat(this.format, { lossless: true })
          .toFile(imageFullPath);

        // Run all promises
        Promise.all([imagePromise])
          .then((output) => {
            cb(null, {
              filename: filename,
              imageWidth: output[0].width,
              imageHeight: output[0].height,
              originalname: file.originalname,
              path: imageFullPath,
              size: output[0].size,
            });
          })
          .catch((error) => {
            this.logger.error('Error during processing images Stream');
            cb(error, null);
          });
      } else {
        const outStream = fs.createWriteStream(imageFullPath);
        file.stream.pipe(outStream);
        outStream.on('error', cb);
        outStream.on('finish', function () {
          cb(null, {
            filename: filename,
            originalname: file.originalname,
            path: imageFullPath,
            size: file.size,
          });
        });
      }
    });
  }

  _removeFile(req, file, cb) {
    fs.unlink(file.path, cb);
  }
}
