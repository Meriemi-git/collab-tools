import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  ConfirmEmail,
  getAuthError,
  isConfirmed,
  StratEditorState,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';
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
    private readonly store: Store<StratEditorState>
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
