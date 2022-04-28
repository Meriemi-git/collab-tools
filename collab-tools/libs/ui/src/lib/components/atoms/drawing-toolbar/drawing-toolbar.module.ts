import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TooltipModule } from 'primeng/tooltip';
import { DrawingToolbarComponent } from './drawing-toolbar.component';
@NgModule({
  declarations: [DrawingToolbarComponent],
  imports: [
    CommonModule,
    TooltipModule,
    ButtonModule,
    DividerModule,
    TranslateModule,
  ],
  exports: [DrawingToolbarComponent],
})
export class DrawingToolbarModule {}
