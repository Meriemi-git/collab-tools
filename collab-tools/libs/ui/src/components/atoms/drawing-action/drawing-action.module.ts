import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { DrawingActionComponent } from './drawing-action.component';
@NgModule({
  declarations: [DrawingActionComponent],
  imports: [CommonModule, SvgIconModule, ButtonModule, FormsModule],
  exports: [DrawingActionComponent],
})
export class DrawingActionModule {}
