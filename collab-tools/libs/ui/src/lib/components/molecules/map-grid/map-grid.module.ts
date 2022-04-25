import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StratMapItemModule } from '../../atoms/map-item/map-item.module';
import { StratMapGridComponent } from './map-grid.component';

@NgModule({
  declarations: [StratMapGridComponent],
  imports: [CommonModule, StratMapItemModule],
  exports: [StratMapGridComponent],
})
export class StratMapGridModule {}
