import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Draw, PageOptions, PaginateResult } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DrawService {
  private readonly controller = 'draws';
  constructor(private readonly http: HttpClient) {}

  public getDrawsPaginated(pageOptions: PageOptions) {
    return this.http.get<PaginateResult<Draw>>(
      `${environment.apiUrl}/${this.controller}/paginated?limit=${pageOptions.limit}&page=${pageOptions.page}`
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
}
