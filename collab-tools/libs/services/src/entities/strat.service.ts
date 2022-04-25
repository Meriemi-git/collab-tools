import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AttributeFilter,
  Like,
  PageOptions,
  PaginateResult,
  Strat,
} from '@collab-tools/datamodel';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StratService {
  private readonly controller = 'strats';
  constructor(private readonly http: HttpClient) {}

  public getStratsPaginated(
    pageOptions: PageOptions,
    stratFilter: AttributeFilter
  ) {
    return this.http.post<PaginateResult<Strat>>(
      `${environment.apiUrl}/${this.controller}/paginated?limit=${pageOptions.limit}&page=${pageOptions.page}`,
      stratFilter
    );
  }

  public saveStrat(strat: Strat): Observable<Strat> {
    return this.http.post<Strat>(
      `${environment.apiUrl}/${this.controller}`,
      strat
    );
  }

  public deleteStrat(stratId: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/${this.controller}/${stratId}`
    );
  }

  public updateStrat(strat: Strat): Observable<Strat> {
    return this.http.patch<Strat>(
      `${environment.apiUrl}/${this.controller}`,
      strat
    );
  }

  public loadStratById(stratId: string): Observable<Strat> {
    return this.http.get<Strat>(
      `${environment.apiUrl}/${this.controller}/${stratId}`
    );
  }

  public likeStrat(stratId: string): Observable<Like> {
    return this.http.get<Like>(
      `${environment.apiUrl}/${this.controller}/like/${stratId}`
    );
  }

  public dislikeStrat(stratId: string): Observable<string> {
    return this.http.get<string>(
      `${environment.apiUrl}/${this.controller}/dislike/${stratId}`
    );
  }
}
