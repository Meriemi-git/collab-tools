import { NgModule } from '@angular/core';
import { FilterPipe } from './helpers/filter-pipe';
import { SortPipe } from './helpers/sort-pipe';

@NgModule({
  declarations: [FilterPipe, SortPipe],
  imports: [],
  providers: [],
  bootstrap: [],
  exports: [FilterPipe, SortPipe],
})
export class PipesModule {}
