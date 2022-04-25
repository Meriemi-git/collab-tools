export class CookieParser {
  public static GetCookieValue(
    cookieName: string,
    cookieValue: string
  ): string {
    let result: string;
    cookieValue.split(';').forEach((cookie) => {
      const nameAndValue = cookie.trim().split('=');
      if (
        nameAndValue &&
        nameAndValue.length == 2 &&
        nameAndValue[0] === cookieName
      ) {
        result = nameAndValue[1];
      }
    });
    return result;
  }
}
