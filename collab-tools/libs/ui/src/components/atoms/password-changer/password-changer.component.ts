import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PasswordChangeWrapper } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-password-changer',
  templateUrl: './password-changer.component.html',
  styleUrls: ['./password-changer.component.scss'],
})
export class PasswordChangerComponent {
  @Input() errorMessage: string;
  @Output() passwordChanged = new EventEmitter<PasswordChangeWrapper>();

  private readonly passwordRegex: string =
    '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}';

  public passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordRegex),
      ]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordRegex),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
        Validators.pattern(this.passwordRegex),
      ]),
    },
    {
      validators: this.passwordConfirming,
    }
  );

  public isSubmitted: boolean;

  public get formControls() {
    return this.passwordForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.passwordForm.valid) {
      const passwords: PasswordChangeWrapper = {
        oldPassword: this.passwordForm.get('oldPassword').value,
        newPassword: this.passwordForm.get('password').value,
      };
      this.passwordChanged.emit(passwords);
    }
  }

  private passwordConfirming(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('confirmPassword').value) {
      return { invalid: true };
    }
    return null;
  }
}
