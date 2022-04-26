import { Draw, DrawDocument } from '@collab-tools/datamodel';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  FilterQuery,
  PaginateModel,
  PaginateOptions,
  PaginateResult,
} from 'mongoose';

@Injectable()
export class DrawService {
  private readonly logger = new Logger(DrawService.name);
  private readonly X_AUTH_TOKEN: string = 'X-AUTH-TOKEN';

  constructor(
    @InjectModel('Draw')
    private readonly drawModel: PaginateModel<DrawDocument>
  ) {}

  public async addDraw(draw: Draw): Promise<Draw> {
    const createdDraw = new this.drawModel(draw);
    return createdDraw.save();
  }

  public async findDrawsPaginated(
    limit: number,
    page: number,
    userId: string
  ): Promise<PaginateResult<Draw>> {
    const options: PaginateOptions = {
      limit: limit,
      page: page,
      sort: { name: 'asc' },
    };
    const query: FilterQuery<DrawDocument> = {};
    query.userId = userId;
    return this.drawModel.paginate(query, options);
  }

  public async findDrawById(userId: string, drawId: string): Promise<Draw> {
    return this.drawModel.findOne({ userId: userId, _id: drawId }).exec();
  }

  public async updateDraw(draw: Draw): Promise<Draw> {
    return this.drawModel
      .findByIdAndUpdate(draw._id, draw, {
        new: true,
      })
      .exec();
  }

  public async deleteDraw(drawId: string): Promise<Draw> {
    return this.drawModel.findByIdAndDelete(drawId).exec();
  }
}
