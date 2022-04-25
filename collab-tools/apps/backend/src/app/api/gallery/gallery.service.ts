import { Image, ImageDocument } from '@collab-tools/datamodel';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class GalleryService {
  private readonly logger = new Logger(GalleryService.name);
  private readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';
  constructor(
    @InjectModel('Image')
    private readonly imageModel: Model<ImageDocument>
  ) {}

  public getAllImagesForUser(userId: string): Promise<Image[]> {
    return this.imageModel
      .find({ userId: userId })
      .sort([['uploadedAt', -1]])
      .exec();
  }

  public async saveImage(file: any, userId: string): Promise<Image> {
    const image = {
      fileName: file.filename,
      imageName: file.originalname,
      size: file.size,
      userId: userId,
      uploadedAt: new Date(),
      imageWidth: file.imageWidth,
      imageHeight: file.imageHeight,
      thumbWidth: file.thumbWidth,
      thumbHeight: file.thumbHeight,
    } as Image;
    try {
      const newImage = await new this.imageModel(image).save();
      return newImage;
    } catch (error) {
      throw new InternalServerErrorException('Cannot save the image');
    }
  }

  public async deleteImage(imageId: string, userId: string): Promise<any> {
    const image = await this.imageModel
      .findOne({ _id: imageId, userId: userId })
      .exec();
    try {
      await image.remove();
      return true;
    } catch (error) {
      this.logger.error('Error during deletion of image');
      throw new InternalServerErrorException('Error during deletion of image');
    }
  }
}
