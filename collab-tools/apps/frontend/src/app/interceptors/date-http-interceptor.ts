import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DateHttpInterceptor implements HttpInterceptor {
  private readonly iso8601 =
    /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(\.\d+)?(([+-]\d\d:\d\d)|Z)?$/;

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      map((event) => {
        if (event instanceof HttpResponse) {
          const body = event.body;
          this.convertToDate(body);
          return event;
        }
      })
    );
  }

  convertToDate(body) {
    if (body == null || body === undefined || typeof body !== 'object') {
      return body;
    }

    for (const key of Object.keys(body)) {
      if (typeof body[key] === 'object') {
        this.convertToDate(body[key]);
      } else if (key.endsWith('At')) {
        const value = body[key];
        if (this.isIso8601(value)) {
          console.log('Date creation for attr : ' + key);
          body[key] = new Date(value);
        }
        return body;
      }
    }
    return body;
  }

  isIso8601(value) {
    if (value == null || value == undefined) {
      return false;
    }
    return this.iso8601.test(value);
  }
}
