import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { AddGadgetComponent } from './add-gadget.component';

@NgModule({
  declarations: [AddGadgetComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    DropdownModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [AddGadgetComponent],
})
export class AddGadgetModule {}
