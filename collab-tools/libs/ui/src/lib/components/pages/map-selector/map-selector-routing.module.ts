import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MapSelectorComponent } from './map-selector.component';

export const routes: Routes = [{ path: '', component: MapSelectorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MapSelectorRoutingModule {}
