import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbsctractObserverComponent } from '@collab-tools/bases';
import {
  CollabToolsState,
  ConfirmEmail,
  getAuthError,
  isConfirmed,
} from '@collab-tools/store';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'collab-tools-confirmation',
  templateUrl: './confirmation.component.html',
})
export class ConfirmationComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $httpError: Observable<HttpErrorResponse>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly store: Store<CollabToolsState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.$httpError = this.store.select(getAuthError);
    this.store.select(isConfirmed).subscribe((isConfirmed) => {
      if (isConfirmed) {
        this.router.navigateByUrl('/');
      }
    });
    this.route.params.pipe(takeUntil(this.unsubscriber)).subscribe((params) => {
      if (params.token) {
        this.store.dispatch(ConfirmEmail({ token: params.token }));
      }
    });
  }
}
