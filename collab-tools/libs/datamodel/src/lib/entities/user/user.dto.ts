import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { UserRole } from '../../enums';
import { User } from './user';
export class UserDto extends User {
  @IsOptional()
  _id: string;
  @IsNotEmpty()
  @IsString()
  locale: string;
  @IsNotEmpty()
  @IsString()
  mail: string;
  @IsOptional()
  @IsBoolean()
  confirmed: boolean;
  @IsOptional()
  @IsEnum(UserRole)
  role: UserRole;
  @IsBoolean()
  @IsNotEmpty()
  cguAgreement: boolean;
  @IsBoolean()
  @IsDate()
  cguAcceptedAt: Date;
  @IsNotEmpty()
  @IsString()
  username: string;
  @IsNotEmpty()
  @IsString()
  password: string;
}
