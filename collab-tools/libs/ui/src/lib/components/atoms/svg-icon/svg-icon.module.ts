import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SvgIconComponent } from './svg-icon.component';
@NgModule({
  declarations: [SvgIconComponent],
  imports: [CommonModule, InlineSVGModule.forRoot()],
  exports: [SvgIconComponent],
})
export class SvgIconModule {}
