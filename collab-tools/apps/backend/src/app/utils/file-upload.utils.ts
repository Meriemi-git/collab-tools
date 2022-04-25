import { BadRequestException } from '@nestjs/common';

export const imageMimeTypes: string[] = [
  'image/jpg',
  'image/jpeg',
  'image/png',
  'image/bmp',
  'image/gif',
  'image/webp',
];

export const imageExtensions: string[] = [
  'jpg',
  'jpeg',
  'png',
  'bmp',
  'gif',
  'webp',
];

export const imageFileFilter = (req, file, callback): any => {
  const extension: string = file.originalname.substring(
    file.originalname.lastIndexOf('.') + 1
  );

  if (!imageExtensions.some((ext) => ext === extension.toLocaleLowerCase())) {
    return callback(new BadRequestException('Wrong file extension'), false);
  }
  if (
    !imageMimeTypes.some((type) => type === file.mimetype.toLocaleLowerCase())
  ) {
    return callback(new BadRequestException('Wrong upload mimtype'), false);
  }
  return callback(null, true);
};
