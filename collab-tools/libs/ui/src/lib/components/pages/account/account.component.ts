import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  Language,
  PasswordChangeWrapper,
  UserDto,
} from '@collab-tools/datamodel';
import {
  ChangeLang,
  ChangeMail,
  ChangePassword,
  getAuthError,
  getUserInfos,
  SendConfirmationEmail,
  StratEditorState,
} from '@collab-tools/store';
import { Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public $userInfos: Observable<UserDto>;
  public $httpError: Observable<HttpErrorResponse>;
  constructor(private readonly store: Store<StratEditorState>) {
    super();
  }

  ngOnInit(): void {
    this.$userInfos = this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber));
    this.$httpError = this.store
      .select(getAuthError)
      .pipe(takeUntil(this.unsubscriber));
  }

  onPasswordChanged(passwords: PasswordChangeWrapper) {
    this.store.dispatch(ChangePassword({ passwords }));
  }

  onMailChange(newMail: string) {
    this.store.dispatch(ChangeMail({ newMail }));
  }

  onResendEmailLink() {
    this.store.dispatch(SendConfirmationEmail());
  }

  onLangChange(lang: Language) {
    this.store.dispatch(ChangeLang({ lang }));
  }
}
