import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StratMap, StratMap as StratStratMap } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StratMapService {
  private readonly controller = 'strat-maps';

  constructor(private readonly http: HttpClient) {}

  getAllStratMaps(): Observable<StratStratMap[]> {
    return this.http.get<StratStratMap[]>(
      `${environment.apiUrl}/${this.controller}/all`
    );
  }

  addStratMap(data: FormData): Observable<StratMap> {
    return this.http.post<StratMap>(
      `${environment.apiUrl}/${this.controller}`,
      data
    );
  }

  updateStratMap(data: FormData): Observable<StratMap> {
    return this.http.patch<StratMap>(
      `${environment.apiUrl}/${this.controller}`,
      data
    );
  }

  deleteStratMap(stratMapId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${stratMapId}`
    );
  }
}
