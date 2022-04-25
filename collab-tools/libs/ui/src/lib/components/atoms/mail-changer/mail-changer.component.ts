import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'collab-tools-mail-changer',
  templateUrl: './mail-changer.component.html',
  styleUrls: ['./mail-changer.component.scss'],
})
export class MailChangerComponent {
  @Input() errorMessage: string;
  @Input() oldMail: string;
  @Output() mailChange = new EventEmitter<string>();

  public isSubmitted = false;

  public mailForm = new FormGroup(
    {
      newMail: new FormControl('', [Validators.required, Validators.email]),
    },
    {
      validators: this.mustBeDifferent.bind(this),
    }
  );

  onSubmit() {
    if (this.mailForm.valid) {
      this.mailChange.emit(this.mailForm.get('newMail').value);
    }
  }

  private mustBeDifferent(c: AbstractControl): { notDifferent: boolean } {
    if (c.get('newMail').value === this.oldMail) {
      return { notDifferent: true };
    } else {
      return null;
    }
  }

  get formControls() {
    return this.mailForm.controls;
  }
}
