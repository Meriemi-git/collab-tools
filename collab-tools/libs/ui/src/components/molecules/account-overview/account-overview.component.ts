import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserDto } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-account-overview',
  templateUrl: './account-overview.component.html',
  styleUrls: ['./account-overview.component.scss'],
})
export class AccountOverviewComponent {
  @Input()
  public userInfos: UserDto;
  @Input()
  public errorMessage: string;
  @Output()
  public resendEmailLink = new EventEmitter<void>();
}
