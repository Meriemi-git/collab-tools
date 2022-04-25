import { UserDto } from '../../entities';

export interface AuthInfos {
  userDto: UserDto;
  authToken: string;
  refreshToken: string;
}
