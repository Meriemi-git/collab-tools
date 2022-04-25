import { RefreshToken, UserDto } from '../../entities';

export interface PairedTokens {
  jwtId: string;
  userDto: UserDto;
  refreshToken: RefreshToken;
}
