import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Store } from '@ngrx/store';
import { isStratOrMapDefined, StratEditorState } from '@collab-tools/store';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CanActivateEditorGuard implements CanActivate {
  constructor(private readonly store: Store<StratEditorState>) {}

  public canActivate(_route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.store.select(isStratOrMapDefined);
  }
}
