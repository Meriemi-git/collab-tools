import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { CollabToolsState, isStratOrMapDefined } from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanActivateEditorGuard implements CanActivate {
  constructor(private readonly store: Store<CollabToolsState>) {}

  public canActivate(_route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(isStratOrMapDefined);
  }
}
