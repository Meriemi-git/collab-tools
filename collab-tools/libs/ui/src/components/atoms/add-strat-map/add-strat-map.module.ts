import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { AddFloorModule } from '../add-floor/add-floor.module';
import { FloorListModule } from '../floor-list/floor-list.module';
import { AddStratMapComponent } from './add-strat-map.component';
@NgModule({
  declarations: [AddStratMapComponent],
  imports: [
    CommonModule,
    FormsModule,
    FloorListModule,
    AddFloorModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    ConfirmDialogModule,
    AccordionModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  exports: [AddStratMapComponent],
  providers: [ConfirmationService],
})
export class AddStratMapModule {}
