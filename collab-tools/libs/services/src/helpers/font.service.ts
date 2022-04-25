import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FontService {
  private readonly controller = 'fonts';
  constructor(private readonly http: HttpClient) {}

  getAllFonts(): Observable<string[]> {
    return this.http
      .get<string[]>(`${environment.apiUrl}/${this.controller}/all`)
      .pipe(
        catchError((err) => {
          return throwError(err);
        })
      );
  }
}
