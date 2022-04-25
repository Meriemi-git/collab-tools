import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { LayerSelectorComponent } from './layer-selector.component';

@NgModule({
  declarations: [LayerSelectorComponent],
  imports: [CommonModule, DropdownModule, FormsModule, TranslateModule],
  exports: [LayerSelectorComponent],
})
export class LayerSelectorModule {}
