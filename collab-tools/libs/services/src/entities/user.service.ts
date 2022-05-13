import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AnonUser,
  Language,
  PageOptions,
  PaginateResult,
  PasswordChangeWrapper,
  UserDto,
} from '@collab-tools/datamodel';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import * as uuid from 'uuid';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly controller = 'users';

  constructor(private readonly http: HttpClient) {}

  public getUsersPaginated(pageOptions: PageOptions) {
    return this.http.get<PaginateResult<UserDto>>(
      `${environment.apiUrl}/${this.controller}/paginated?limit=${pageOptions.limit}&page=${pageOptions.page}`
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

  public createAnonUser(): Observable<AnonUser> {
    const anon: AnonUser = {
      pseudo: 'Anonymous',
      id: uuid.v4(),
    };
    localStorage.setItem('anonUser', JSON.stringify(anon));
    return of(anon);
  }
}
