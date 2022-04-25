import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../../enums';
import { User } from './user';
export class UserPartialDto extends User {
  @IsOptional()
  _id: string;
  @IsString()
  @IsOptional()
  locale: string;
  @IsString()
  @IsOptional()
  mail: string;
  @IsBoolean()
  @IsOptional()
  confirmed: boolean;
  @IsEnum(UserRole)
  @IsOptional()
  role: UserRole;
  @IsBoolean()
  @IsOptional()
  cguAgreement: boolean;
  @IsDate()
  @IsOptional()
  cguAcceptedAt: Date;
  @IsString()
  @IsOptional()
  username: string;
  @IsOptional()
  @IsString()
  password: string;
  @IsOptional()
  @IsString()
  socketId: string;
}
