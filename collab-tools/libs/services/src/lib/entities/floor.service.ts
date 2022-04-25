import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StratMap } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class FloorService {
  private readonly controller = 'floors';

  constructor(private readonly http: HttpClient) {}

  addFloor(mapId: string, data: FormData): Observable<StratMap> {
    return this.http.post<StratMap>(
      `${environment.apiUrl}/${this.controller}/${mapId}`,
      data
    );
  }

  updateFloor(mapId: string, data: FormData): Observable<StratMap> {
    return this.http.patch<StratMap>(
      `${environment.apiUrl}/${this.controller}/${mapId}`,
      data
    );
  }

  deleteFloor(mapId: string, floorId: string): Observable<StratMap> {
    return this.http.delete<StratMap>(
      `${environment.apiUrl}/${this.controller}/${mapId}/floor/${floorId}`
    );
  }
}
