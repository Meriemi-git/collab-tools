import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PipesModule } from '../../../pipes.module';
import { StratFiltersModule } from '../strat-filters/strat-filters.module';
import { StratGridModule } from '../strat-grid/strat-grid.module';
import { FilteredStratsComponent } from './filtered-strats.component';
@NgModule({
  declarations: [FilteredStratsComponent],
  imports: [
    CommonModule,
    StratFiltersModule,
    StratGridModule,
    PipesModule,
    AccordionModule,
    ConfirmDialogModule,
    PaginatorModule,
    OverlayPanelModule,
    TranslateModule,
  ],
  exports: [FilteredStratsComponent],
})
export class FilteredStratsModule {}
