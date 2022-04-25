import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CheckboxModule } from 'primeng/checkbox';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { AddFloorComponent } from './add-floor.component';

@NgModule({
  declarations: [AddFloorComponent],
  imports: [
    CommonModule,
    FormsModule,
    CheckboxModule,
    InputTextModule,
    FileUploadModule,
    TranslateModule,
  ],
  exports: [AddFloorComponent],
})
export class AddFloorModule {}
