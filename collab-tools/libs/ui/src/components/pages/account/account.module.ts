import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TabViewModule } from 'primeng/tabview';
import { MailChangerModule } from '../../atoms/mail-changer/mail-changer.module';
import { PasswordChangerModule } from '../../atoms/password-changer/password-changer.module';
import { SvgIconModule } from '../../atoms/svg-icon/svg-icon.module';
import { AccountOverviewModule } from '../../molecules/account-overview/account-overview.module';
import { AccountSecurityModule } from '../../molecules/account-security/account-security.module';
import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
@NgModule({
  declarations: [AccountComponent],
  imports: [
    CommonModule,
    AccountRoutingModule,
    PasswordChangerModule,
    TabViewModule,
    MailChangerModule,
    SvgIconModule,
    AccountOverviewModule,
    AccountSecurityModule,
    TranslateModule,
  ],
})
export class AccountModule {}
