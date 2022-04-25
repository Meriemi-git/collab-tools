import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationRoutingModule } from './confirmation-routing.module';
import { ConfirmationComponent } from './confirmation.component';

@NgModule({
  declarations: [ConfirmationComponent],
  imports: [CommonModule, ConfirmationRoutingModule, TranslateModule],
  exports: [ConfirmationComponent],
})
export class ConfirmationModule {}
