import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { UserDto } from '@collab-tools/datamodel';
import { UserService } from '@collab-tools/services';
import { Disconnect, StratEditorState } from '@collab-tools/store';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

@Injectable()
export class JwtHttpInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<unknown> =
    new BehaviorSubject<unknown>(null);
  constructor(
    private readonly userService: UserService,
    private readonly store: Store<StratEditorState>,
    private readonly router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            const lastUrlSegment = getLastUrlSegment(request.url);
            switch (lastUrlSegment) {
              case 'disconnect':
              case 'login':
              case 'register':
              case 'refresh':
                this.store.dispatch(Disconnect({ withNotif: false }));
                return throwError(error);
              default:
                return this.handle401Error(request, next);
            }
          } else if (error.status === 503) {
            this.router.navigateByUrl('maintenance');
            return throwError(error);
          } else {
            return throwError(error);
          }
        } else {
          return throwError(error);
        }
      })
    );
  }

  private handle401Error(request: HttpRequest<unknown>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.userService.refreshToken().pipe(
        switchMap((userInfos: UserDto) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(userInfos);
          return next.handle(request.clone());
        }),
        catchError((err: HttpErrorResponse) => {
          this.isRefreshing = false;
          return throwError(err);
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap(() => {
          return next.handle(request.clone());
        }),
        catchError((error) => {
          this.refreshTokenSubject.unsubscribe();
          this.refreshTokenSubject = new BehaviorSubject<unknown>(null);
          this.isRefreshing = false;
          throw throwError(error);
        })
      );
    }
  }
}
function getLastUrlSegment(url: string): string {
  if (url.charAt(url.length - 1) === '/') {
    url = url.substr(0, url.length - 1);
  }
  const segments = url.split('/');
  return segments[segments.length - 1];
}
