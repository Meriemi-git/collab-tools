import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gadget } from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class GadgetService {
  private readonly controller = 'gadgets';

  constructor(private readonly http: HttpClient) {}

  getAllGadgets(): Observable<Gadget[]> {
    return this.http.get<Gadget[]>(
      `${environment.apiUrl}/${this.controller}/all`
    );
  }

  addGadget(data: FormData): Observable<Gadget> {
    return this.http.post<Gadget>(
      `${environment.apiUrl}/${this.controller}`,
      data
    );
  }

  updateGadget(data: FormData): Observable<Gadget> {
    return this.http.patch<Gadget>(
      `${environment.apiUrl}/${this.controller}`,
      data
    );
  }

  deleteGadget(gadgetId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${gadgetId}`
    );
  }
}
