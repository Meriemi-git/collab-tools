import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DividerModule } from 'primeng/divider';
import { AccountOverviewComponent } from './account-overview.component';
@NgModule({
  declarations: [AccountOverviewComponent],
  imports: [
    CommonModule,
    ChipModule,
    DividerModule,
    ButtonModule,
    TranslateModule,
  ],
  exports: [AccountOverviewComponent],
})
export class AccountOverviewModule {}
