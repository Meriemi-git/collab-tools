import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AttributeFilter,
  Draw,
  Like,
  PageOptions,
  PaginateResult,
} from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  private readonly controller = 'draws';
  constructor(private readonly http: HttpClient) {}

  public getDrawsPaginated(
    pageOptions: PageOptions,
    drawFilter: AttributeFilter
  ) {
    return this.http.post<PaginateResult<Draw>>(
      `${environment.apiUrl}/${this.controller}/paginated?limit=${pageOptions.limit}&page=${pageOptions.page}`,
      drawFilter
    );
  }

  public saveDraw(draw: Draw): Observable<Draw> {
    return this.http.post<Draw>(
      `${environment.apiUrl}/${this.controller}`,
      draw
    );
  }

  public deleteDraw(drawId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${drawId}`
    );
  }

  public updateDraw(draw: Draw): Observable<Draw> {
    return this.http.patch<Draw>(
      `${environment.apiUrl}/${this.controller}`,
      draw
    );
  }

  public loadDrawById(drawId: string): Observable<Draw> {
    return this.http.get<Draw>(
      `${environment.apiUrl}/${this.controller}/${drawId}`
    );
  }

  public likeDraw(drawId: string): Observable<Like> {
    return this.http.get<Like>(
      `${environment.apiUrl}/${this.controller}/like/${drawId}`
    );
  }

  public dislikeDraw(drawId: string): Observable<string> {
    return this.http.get<string>(
      `${environment.apiUrl}/${this.controller}/dislike/${drawId}`
    );
  }
}
