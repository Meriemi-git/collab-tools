import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  Language,
  PasswordChangeWrapper,
  UserDto,
} from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-account-security',
  templateUrl: './account-security.component.html',
})
export class AccountSecurityComponent {
  @Input()
  public userInfos: UserDto;
  @Input()
  public errorMessage: string;
  @Output()
  public passwordChange = new EventEmitter<PasswordChangeWrapper>();
  @Output()
  public mailChange = new EventEmitter<string>();
  @Output()
  public langChange = new EventEmitter<Language>();

  public onLangSelected(lang: Language) {
    this.langChange.emit(lang);
  }
}
