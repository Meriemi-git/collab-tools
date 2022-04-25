import { ChatMessage, WebsocketMemberStatus } from '@collab-tools/datamodel';

export interface IChatSocketListener {
  onConnected(): void;
  onConnectionClosed(reason: string): void;
  onMessageReceived(message: ChatMessage): void;
  onStatusChanged(statuis: WebsocketMemberStatus): void;
}
