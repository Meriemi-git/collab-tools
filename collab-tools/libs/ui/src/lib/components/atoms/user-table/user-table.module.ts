import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { UserTableComponent } from './user-table.component';

@NgModule({
  declarations: [UserTableComponent],
  imports: [
    CommonModule,
    TableModule,
    ChipModule,
    ButtonModule,
    PaginatorModule,
    InputTextModule,
    DropdownModule,
    TriStateCheckboxModule,
    TranslateModule,
  ],
  exports: [UserTableComponent],
})
export class UserTableModule {}
