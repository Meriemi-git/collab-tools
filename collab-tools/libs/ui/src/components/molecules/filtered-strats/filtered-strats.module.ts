import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';
import { PipesModule } from '../../../pipes.module';
import { DrawFiltersModule } from '../draw-filters/draw-filters.module';
import { DrawGridModule } from '../draw-grid/draw-grid.module';
import { FilteredDrawsComponent } from './filtered-draws.component';
@NgModule({
  declarations: [FilteredDrawsComponent],
  imports: [
    CommonModule,
    DrawFiltersModule,
    DrawGridModule,
    PipesModule,
    AccordionModule,
    ConfirmDialogModule,
    PaginatorModule,
    OverlayPanelModule,
    TranslateModule,
  ],
  exports: [FilteredDrawsComponent],
})
export class FilteredDrawsModule {}
