import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedStratsRoutingModule } from './shared-strats-routing.module';
import { SharedStratsComponent } from './shared-strats.component';
import { FilteredStratsModule } from '../../molecules/filtered-strats/filtered-strats.module';

@NgModule({
  declarations: [SharedStratsComponent],
  imports: [CommonModule, SharedStratsRoutingModule, FilteredStratsModule],
  exports: [SharedStratsComponent],
})
export class SharedStratsModule {}
