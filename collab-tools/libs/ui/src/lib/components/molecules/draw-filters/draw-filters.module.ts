import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { DrawFiltersComponent } from './draw-filters.component';

@NgModule({
  declarations: [DrawFiltersComponent],
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
  exports: [DrawFiltersComponent],
})
export class DrawFiltersModule {}
