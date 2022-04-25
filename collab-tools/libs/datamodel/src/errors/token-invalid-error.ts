export class TokenInvalidError extends Error {
  name: string;
  stack?: string;
  message: string;
}
