import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DropdownModule } from 'primeng/dropdown';
import { LangSelectorComponent } from './lang-selector.component';

@NgModule({
  declarations: [LangSelectorComponent],
  imports: [CommonModule, DropdownModule, TranslateModule, FormsModule],
  exports: [LangSelectorComponent],
})
export class LangSelectorModule {}
