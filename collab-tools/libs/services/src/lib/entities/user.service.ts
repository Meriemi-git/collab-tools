import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AttributeFilter,
  Language,
  Like,
  PageOptions,
  PaginateResult,
  PasswordChangeWrapper,
  UserDto,
} from '@collab-tools/datamodel';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly controller = 'users';

  constructor(private readonly http: HttpClient) {}

  public getUsersPaginated(
    pageOptions: PageOptions,
    userFilters: AttributeFilter
  ) {
    return this.http.post<PaginateResult<UserDto>>(
      `${environment.apiUrl}/${this.controller}/paginated?limit=${pageOptions.limit}&page=${pageOptions.page}`,
      userFilters
    );
  }

  public getUsersLikes(): Observable<Like[]> {
    return this.http.get<Like[]>(
      `${environment.apiUrl}/${this.controller}/likes`
    );
  }

  public getUserInfos() {
    return this.http
      .get<UserDto>(`${environment.apiUrl}/${this.controller}/infos`)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public changePassword(passwords: PasswordChangeWrapper): Observable<UserDto> {
    return this.http.post<UserDto>(
      `${environment.apiUrl}/${this.controller}/change-password`,
      passwords
    );
  }

  public changeMail(newMail: string): Observable<UserDto> {
    return this.http.post<UserDto>(
      `${environment.apiUrl}/${this.controller}/change-mail`,
      {
        newMail,
      }
    );
  }

  public changeLang(lang: Language) {
    return this.http.patch<UserDto>(
      `${environment.apiUrl}/${this.controller}/lang/${lang.locale}`,
      null
    );
  }

  public register(userDto: Partial<UserDto>): Observable<UserDto> {
    return this.http.post<UserDto>(
      `${environment.apiUrl}/${this.controller}/register`,
      userDto
    );
  }

  public sendConfirmationEmail(): Observable<UserDto> {
    return this.http.get<UserDto>(
      `${environment.apiUrl}/${this.controller}/send-confirmation-mail`
    );
  }

  public updateUser(updated: UserDto): Observable<UserDto> {
    return this.http.patch<UserDto>(
      `${environment.apiUrl}/${this.controller}/${updated._id}`,
      updated
    );
  }

  public deleteUser(deleted: UserDto): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${deleted._id}`
    );
  }
  public login(userDto: Partial<UserDto>): Observable<UserDto> {
    return this.http.post<UserDto>(
      `${environment.apiUrl}/${this.controller}/auth/login`,
      userDto
    );
  }

  public refreshToken(): Observable<UserDto> {
    return this.http
      .get<UserDto>(`${environment.apiUrl}/${this.controller}/auth/refresh/`)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }

  public confirmEmail(token: string) {
    return this.http.get(
      `${environment.apiUrl}/${this.controller}/confirm/${token}`
    );
  }

  public disconnect() {
    localStorage.removeItem('userInfos');
    return this.http.get(
      `${environment.apiUrl}/${this.controller}/auth/disconnect`
    );
  }

  public searchUsers(text: string): Observable<string[]> {
    return this.http.post<string[]>(
      `${environment.apiUrl}/${this.controller}/search`,
      {
        text,
      }
    );
  }

  public getWebsocketAccess(): Observable<void> {
    return this.http.get<void>(
      `${environment.apiUrl}/${this.controller}/ws-access`
    );
  }
}
