import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DrawingStatusComponent } from './drawing-status.component';

@NgModule({
  declarations: [DrawingStatusComponent],
  imports: [CommonModule, ButtonModule, TooltipModule, TranslateModule],
  exports: [DrawingStatusComponent],
})
export class DrawingStatusModule {}
