import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { StratMapSelectorComponent } from './map-selector.component';

@NgModule({
  declarations: [StratMapSelectorComponent],
  imports: [CommonModule, DropdownModule, FormsModule, TranslateModule],
  exports: [StratMapSelectorComponent],
})
export class StratMapSelectorModule {}
