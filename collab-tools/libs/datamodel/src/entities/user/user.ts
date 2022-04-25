import * as bcrypt from 'bcryptjs';
import { Document, Schema } from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate-v2';
import { UserRole } from '../../enums/user-role';

export type UserDocument = User & Document;
export class User {
  _id: string;
  username: string;
  normalized_username: string;
  password: string;
  locale: string;
  mail: string;
  confirmed: boolean;
  role: UserRole;
  cguAgreement: boolean;
  cguAcceptedAt: Date;
  roomSocketId: string;
  chatSocketId: string;
  notificationSocketId: string;
}

export const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
  normalized_username: {
    type: String,
    required: false,
    unique: true,
  },
  mail: {
    type: String,
    required: true,
    unique: true,
  },
  locale: String,
  confirmed: Boolean,
  cguAgreement: {
    type: Boolean,
    required: true,
  },
  cguAcceptedAt: {
    type: Date,
    required: true,
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.REGULAR,
    required: true,
  },
  roomSocketId: {
    type: String,
    required: false,
  },
  chatSocketId: {
    type: String,
    required: false,
  },
  notificationSocketId: {
    type: String,
    required: false,
  },
});

UserSchema.pre<UserDocument>('save', function () {
  return new Promise<void>((resolve, reject) => {
    if (!this.isModified('password')) {
      return resolve();
    }

    bcrypt
      .genSalt(10)
      .then((salt) => {
        bcrypt
          .hash(this.password, salt)
          .then((hash) => {
            this.password = hash;
            this.mail = this.mail.toLocaleLowerCase();
            this.confirmed = false;
            this.normalized_username = this.username.toLocaleLowerCase();
            resolve();
          })
          .catch(() => reject());
      })
      .catch(() => reject());
  });
});

UserSchema.plugin(mongoosePaginate);
