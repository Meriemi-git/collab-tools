import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { LangSelectorModule } from '../../atoms/lang-selector/lang-selector.module';
import { MailChangerModule } from '../../atoms/mail-changer/mail-changer.module';
import { PasswordChangerModule } from '../../atoms/password-changer/password-changer.module';
import { AccountSecurityComponent } from './account-security.component';

@NgModule({
  declarations: [AccountSecurityComponent],
  imports: [
    CommonModule,
    AccordionModule,
    MailChangerModule,
    PasswordChangerModule,
    TranslateModule,
    LangSelectorModule,
  ],
  exports: [AccountSecurityComponent],
})
export class AccountSecurityModule {}
