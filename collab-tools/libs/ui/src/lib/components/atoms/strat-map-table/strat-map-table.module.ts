import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';
import { StratMapTableComponent } from './strat-map-table.component';

@NgModule({
  declarations: [StratMapTableComponent],
  imports: [
    CommonModule,
    TableModule,
    ChipModule,
    DropdownModule,
    ButtonModule,
    TranslateModule,
  ],
  exports: [StratMapTableComponent],
})
export class StratMapTableModule {}
