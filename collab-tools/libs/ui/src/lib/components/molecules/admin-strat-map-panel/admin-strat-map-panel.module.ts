import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AddStratMapModule } from '../../atoms/add-strat-map/add-strat-map.module';
import { StratMapTableModule } from '../../atoms/strat-map-table/strat-map-table.module';
import { AdminStratMapPanelComponent } from './admin-strat-map-panel.component';

@NgModule({
  declarations: [AdminStratMapPanelComponent],
  imports: [CommonModule, AddStratMapModule, StratMapTableModule],
  exports: [AdminStratMapPanelComponent],
})
export class AdminStratMapPanelModule {}
