import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DrawItemModule } from '../../atoms/draw-item/draw-item.module';
import { DrawGridComponent } from './draw-grid.component';

@NgModule({
  declarations: [DrawGridComponent],
  imports: [CommonModule, DrawItemModule, TranslateModule],
  exports: [DrawGridComponent],
})
export class DrawGridModule {}
