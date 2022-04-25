import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { StratFiltersComponent } from './strat-filters.component';

@NgModule({
  declarations: [StratFiltersComponent],
  imports: [
    CommonModule,
    FormsModule,
    MultiSelectModule,
    ButtonModule,
    InputTextModule,
    TriStateCheckboxModule,
    RadioButtonModule,
    TranslateModule,
  ],
  exports: [StratFiltersComponent],
})
export class StratFiltersModule {}
