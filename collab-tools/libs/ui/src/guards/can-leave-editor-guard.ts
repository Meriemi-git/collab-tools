import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';

export interface ComponentCanDeactivate {
  navigateOut: Subject<boolean>;
  canDeactivate(): boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CanLeaveEditorGuard
  implements CanDeactivate<ComponentCanDeactivate>
{
  constructor(private readonly router: Router) {}
  canDeactivate(
    component: ComponentCanDeactivate,
    _currentRoute: ActivatedRouteSnapshot,
    _currentState: RouterStateSnapshot,
    _nextState?: RouterStateSnapshot
  ): boolean | Observable<boolean> {
    const navObject = this.router.getCurrentNavigation();

    // bypass the form guard based on navigation state
    // (used when navigating out after form submit)
    if (
      navObject &&
      navObject.extras.state &&
      navObject.extras.state.bypassEditorGuard
    ) {
      return true;
    } else {
      if (component.canDeactivate()) {
        return true;
      } else {
        return component.navigateOut;
      }
    }
  }
}
