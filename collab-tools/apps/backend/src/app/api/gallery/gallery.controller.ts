import {
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Param,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { Image } from '@collab-tools/datamodel';
import { Request, Response } from 'express';
import { Strategies } from '../../strategies/strategies';
import { JwtTokenService } from '../shared/jwt-token.service';
import { GalleryService } from './gallery.service';

@Controller('gallery')
export class GalleryController {
  private readonly logger = new Logger(GalleryController.name);

  constructor(
    private readonly galleryService: GalleryService,
    private readonly jwtTokenService: JwtTokenService
  ) {}

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Get('images')
  public allMyImages(
    @Req() request: Request,
    @Res() response: Response
  ): Promise<Image[]> {
    const userId = this.jwtTokenService.getUserIdFromRequest(request);
    return this.galleryService.getAllImagesForUser(userId).then((images) => {
      if (images && images.length > 0) {
        response.status(HttpStatus.OK).send(images);
      } else {
        response.status(HttpStatus.NO_CONTENT);
      }
      return images;
    });
  }

  @UseGuards(AuthGuard(Strategies.ConfirmedStrategy))
  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  public uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() request: Request,
    @Res() response: Response
  ): Promise<Image> {
    const userId = this.jwtTokenService.getUserIdFromRequest(request);
    if (file) {
      return this.galleryService.saveImage(file, userId).then((image) => {
        if (image) {
          response.status(HttpStatus.OK).send(image);
          return image;
        } else {
          throw new HttpException('Error during saving image', 466);
        }
      });
    } else {
      throw new HttpException('No image was provided', 467);
    }
  }

  @Delete(':id')
  async deleteGalleryImage(
    @Param('id') id: string,
    @Req() request: Request,
    @Res() response: Response
  ): Promise<void> {
    const userId = this.jwtTokenService.getUserIdFromRequest(request);
    return this.galleryService.deleteImage(id, userId).then(() => {
      response.status(HttpStatus.OK).send();
    });
  }
}
