import { WebsocketStatus } from './websocket-status';

export interface WebsocketMemberStatus {
  userId: string;
  username: string;
  status: WebsocketStatus;
  wsRoomId: string;
}
