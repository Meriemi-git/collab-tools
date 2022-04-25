import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilteredStratsModule } from '../../molecules/filtered-strats/filtered-strats.module';
import { MyStratsRoutingModule } from './my-strats-routing.module';
import { MyStratsComponent } from './my-strats.component';

@NgModule({
  declarations: [MyStratsComponent],
  imports: [CommonModule, MyStratsRoutingModule, FilteredStratsModule],
  exports: [MyStratsComponent],
})
export class MyStratsModule {}
