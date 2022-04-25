export class TokenExpiredError extends Error {
  name: string;
  stack?: string;
  message: string;
}
