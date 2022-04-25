export enum SocketIODisconnectStatus {
  SERVER_DISCONNECT = 'io server disconnect',
  CLIENT_DISCONNECT = 'io client disconnect',
  SERVER_SHUTDOWN = 'io server shutting down',
  PING_TIMEOUT = 'ping timeout',
  CONNEXION_LOST = 'transport close',
  CONNEXION_ERROR = 'transport error',
}
