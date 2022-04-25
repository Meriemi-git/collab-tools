import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ForbiddenException,
  UnauthorizedException,
  WsExceptionFilter,
} from '@nestjs/common';
import { RoomEvent } from '@collab-tools/datamodel';

@Catch()
export class WebSocketExceptionFilter implements WsExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const socket = host.switchToWs().getClient();
    let code: number;
    if (exception instanceof ForbiddenException) {
      code = 403;
    } else if (exception instanceof BadRequestException) {
      code = 400;
    } else if (exception instanceof UnauthorizedException) {
      code = 401;
    }
    socket.emit(RoomEvent.ON_EXCEPTION, code);
  }
}
