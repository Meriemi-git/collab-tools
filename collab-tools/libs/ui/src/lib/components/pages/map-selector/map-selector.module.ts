import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StratMapGridModule } from '../../molecules/map-grid/map-grid.module';
import { MapSelectorRoutingModule } from './map-selector-routing.module';
import { MapSelectorComponent } from './map-selector.component';

@NgModule({
  declarations: [MapSelectorComponent],
  imports: [CommonModule, MapSelectorRoutingModule, StratMapGridModule],
  exports: [MapSelectorComponent],
})
export class MapSelectorModule {}
