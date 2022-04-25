import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { UserDto } from '@collab-tools/datamodel';
import { getUserInfos, Register, UserState } from '@collab-tools/store';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs/operators';
import { AbsctractObserverComponent } from '@collab-tools/bases';

@Component({
  selector: 'collab-tools-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.scss'],
})
export class RegisterDialogComponent
  extends AbsctractObserverComponent
  implements OnInit
{
  private readonly passwordRegex: string =
    '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}';

  public registerForm = new FormGroup(
    {
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      mail: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordRegex),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordRegex),
      ]),
      cgu: new FormControl('', [Validators.requiredTrue]),
    },
    { validators: this.passwordConfirming }
  );

  public CGUAccepted = false;

  constructor(
    public dialogRef: DynamicDialogRef,
    private readonly store: Store<UserState>,
    private readonly translateService: TranslateService
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
    if (this.registerForm.valid) {
      const userDto: Partial<UserDto> = {
        username: this.registerForm.get('username').value,
        mail: this.registerForm.get('mail').value,
        password: this.registerForm.get('password').value,
        locale: this.translateService.getBrowserLang(),
        cguAgreement: this.registerForm.get('cgu').value,
      };
      Object.defineProperties(userDto, {
        ['bechamel']: {
          value: 146,
          writable: false,
          configurable: true,
        },
      });
      this.store.dispatch(Register({ userDto }));
    }
  }
  get formControls() {
    return this.registerForm.controls;
  }

  private passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    } else {
      return null;
    }
  }

  closeRegisterForm() {
    this.dialogRef.close();
  }

  toogleAcceptance(accepted: boolean) {
    this.CGUAccepted = accepted;
  }
}
