import {
  NotificationType,
  Room,
  RoomDocument,
  UserDto,
  WebsocketMember,
  WebsocketMemberRole,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  HttpException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { NotificationService } from '../notification/notification.service';
import { UserService } from '../user/user.service';
import { RoomGateway } from './room.gateway';

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomService.name);

  constructor(
    @InjectModel('Room') private readonly roomModel: Model<RoomDocument>,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => RoomGateway))
    private readonly roomGateway: RoomGateway
  ) {}

  public async createRoom(
    userInfos: UserDto,
    stratMapId: string
  ): Promise<Room> {
    const createdRoom = new this.roomModel({
      ownerId: userInfos._id,
      createdAt: new Date(),
      closed: false,
      stratMapId,
      members: [
        {
          userId: userInfos._id,
          username: userInfos.username,
          socketId: null,
          status: WebsocketStatus.UNKNOWN,
          role: WebsocketMemberRole.OWNER,
        },
      ],
    });
    return createdRoom.save();
  }

  public async getAllRooms(userId: string): Promise<Room[]> {
    return this.roomModel
      .find({
        closed: false,
        members: {
          $elemMatch: { userId: userId },
        },
      })
      .exec();
  }

  public async joinRoom(roomId: string, userId: string): Promise<Room> {
    const canJoin = await this.canJoinTheRoom(userId, roomId);
    if (canJoin) {
      const user = await this.userService.findUserById(userId);
      return this.roomModel
        .findOneAndUpdate(
          {
            _id: roomId,
            closed: false,
            members: {
              $elemMatch: { userId: userId },
            },
          },
          {
            $set: {
              'members.$[element].status': WebsocketStatus.JOINED,
              'members.$[element].socketId': user.roomSocketId,
            },
          },
          {
            arrayFilters: [{ 'element.userId': userId }],
            new: true,
          }
        )
        .exec()
        .then((room) => {
          if (room) {
            const member = room.members.find(
              (m) => m.userId.toString() === userId
            );
            this.roomGateway.joinRoom(room._id.toString(), member);
            return room;
          }
        });
    } else {
      throw new ForbiddenException();
    }
  }

  public async closeRoom(ownerId: string): Promise<Room> {
    const toBeClosed = await this.roomModel
      .findOne({ ownerId, closed: false })
      .exec();
    if (!toBeClosed) {
      throw new BadRequestException();
    }
    const owner = toBeClosed.members.find(
      (m) => m.userId.toString() === ownerId
    );
    this.roomGateway.closeRoom(toBeClosed._id.toString(), owner);
    toBeClosed.closed = true;
    return toBeClosed.save();
  }

  public async leaveRoom(roomId: string, userId: string): Promise<Room> {
    const updatedRoom = await this.roomModel
      .findOneAndUpdate(
        { _id: roomId, closed: false },
        {
          $set: {
            'members.$[element].status': WebsocketStatus.LEAVED,
          },
        },
        {
          arrayFilters: [{ 'element.userId': userId }],
          new: true,
        }
      )
      .exec();
    if (!updatedRoom) {
      throw new BadRequestException();
    }
    const leaver = updatedRoom.members.find(
      (m) => m.userId.toString() === userId
    );
    this.roomGateway.leaveRoom(updatedRoom._id.toString(), leaver);
    return updatedRoom;
  }

  public async canJoinTheRoom(
    userId: string,
    roomId: string
  ): Promise<boolean> {
    const room = await this.getOpenRoomById(roomId);
    if (room) {
      if (room.ownerId.toString() === userId) {
        return true;
      }
      if (room.members.some((member) => member.userId.toString() === userId)) {
        return true;
      }
      throw new ForbiddenException();
    } else {
      throw new BadRequestException();
    }
  }

  public async isMemberOfRoom(
    roomId: string,
    userId: string
  ): Promise<boolean> {
    const room = await this.getOpenRoomById(roomId);
    if (room) {
      return room.members.some((member) => member.userId == userId);
    }
    return false;
  }

  public async inviteUsers(
    roomId: string,
    usernames: string[],
    ownerId: string
  ): Promise<Room> {
    const users = await this.userService.getUsersByUsernames(usernames);
    const room = await this.roomModel.findOne({ _id: roomId, ownerId }).exec();
    if (room && users && users.length > 0) {
      if (room.members.length + users.length > 10) {
        throw new HttpException('Too many room members', 467);
      }
      if (
        room.members.some((m) =>
          users.some((u) => u._id.toString() === m.userId.toString())
        )
      ) {
        throw new HttpException('User already present', 468);
      }
      users.forEach((user) => {
        room.members.push({
          _id: null,
          status: WebsocketStatus.UNKNOWN,
          socketId: null,
          userId: user._id,
          username: user.username,
          role: WebsocketMemberRole.VIEWER,
        } as WebsocketMember);
        this.notificationService.sendNotification(
          user._id.toString(),
          roomId,
          user.notificationSocketId,
          NotificationType.ROOM_INVITATION
        );
      });
      return room.save();
    } else {
      throw new BadRequestException();
    }
  }

  public async updateRoomMemberStatus(
    userId: string,
    roomId: string,
    status: WebsocketStatus,
    sockerId: string
  ): Promise<RoomDocument> {
    const user = await this.userService.findUserById(userId);
    if (user) {
      return this.roomModel
        .findOneAndUpdate(
          { _id: roomId, closed: false },
          {
            $set: {
              'members.$[element].status': status,
              'members.$[element].socketId': sockerId,
            },
          },
          {
            arrayFilters: [{ 'element.userId': userId }],
            new: true,
          }
        )
        .exec();
    } else {
      throw new BadRequestException();
    }
  }

  public async getMyOwnRoom(ownerId: string): Promise<Room> {
    const openedRooms = await this.roomModel
      .find({ ownerId, closed: false })
      .sort('-createdAt')
      .exec();
    if (openedRooms) {
      if (openedRooms.length === 1) {
        return openedRooms[0];
      } else if (openedRooms.length > 1) {
        return this.roomModel
          .updateMany(
            { ownerId, _id: { $ne: openedRooms[0]._id } },
            { closed: true }
          )
          .then(() => {
            return openedRooms[0];
          });
      }
    }
    return null;
  }

  public async getMyConnectedRoom(userId: string): Promise<Room> {
    return this.roomModel
      .findOne({
        closed: false,
        members: {
          $elemMatch: { userId: userId },
        },
      })
      .exec();
  }

  public async ejectUserFromRoom(
    roomId: string,
    userId: string,
    ownerId: string
  ): Promise<Room> {
    if (userId === ownerId) {
      throw new BadRequestException();
    }
    const room = await this.roomModel
      .findOne({
        _id: roomId,
        ownerId,
        members: {
          $elemMatch: { userId: userId },
        },
      })
      .exec();
    if (!room) {
      throw new BadRequestException();
    }
    const toBeEjected = room.members.find(
      (m) => m.userId.toString() === userId
    );
    this.roomGateway.ejectUserFromRoom(toBeEjected, room._id.toString());
    room.members = room.members.filter((m) => m.userId.toString() !== userId);
    return room.save();
  }

  public async isConnected(userId: string, roomId: string): Promise<boolean> {
    return (
      (await this.roomModel.count({
        _id: roomId,
        members: {
          $elemMatch: { userId: userId, status: WebsocketStatus.JOINED },
        },
      })) > 0
    );
  }

  public async canStayInRoom(userId: string, roomId: string): Promise<boolean> {
    return (
      (await this.roomModel.exists({
        _id: roomId,
        closed: false,
        members: {
          $elemMatch: {
            userId: userId,
          },
        },
      })) > 0
    );
  }

  public getOpenRoomById(roomId: string): Promise<RoomDocument> {
    return this.roomModel.findOne({ _id: roomId, closed: false }).exec();
  }
}
