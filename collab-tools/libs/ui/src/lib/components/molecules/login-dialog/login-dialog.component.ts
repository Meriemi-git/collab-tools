import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UserDto } from '@collab-tools/datamodel';
import { getUserInfos, LogIn, UserState } from '@collab-tools/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  public authForm = new FormGroup({
    mailOrUsername: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    public dialogRef: DynamicDialogRef,
    private readonly store: Store<UserState>
  ) {
    super();
  }

  ngOnInit(): void {
    this.store
      .select(getUserInfos)
      .pipe(takeUntil(this.unsubscriber))
      .subscribe((userInfos) => {
        if (userInfos) {
          this.dialogRef.close();
        }
      });
  }

  onSubmit() {
    if (this.authForm.valid) {
      const userDto: Partial<UserDto> = {
        password: this.authForm.get('password').value,
      };
      const mailOrUsername: string = this.authForm.get('mailOrUsername').value;
      if (mailOrUsername.indexOf('@') !== -1) {
        userDto.mail = mailOrUsername;
      } else {
        userDto.username = mailOrUsername;
      }
      this.store.dispatch(LogIn({ userDto }));
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  get formControls() {
    return this.authForm.controls;
  }
}
