import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ListboxModule } from 'primeng/listbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { FloorListComponent } from './floor-list.component';
@NgModule({
  declarations: [FloorListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ListboxModule,
    CheckboxModule,
    ButtonModule,
    ScrollPanelModule,
    TranslateModule,
  ],
  exports: [FloorListComponent],
})
export class FloorListModule {}
