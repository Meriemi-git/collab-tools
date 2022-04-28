import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { DrawSavingDialogComponent } from './draw-saving-dialog.component';
@NgModule({
  declarations: [DrawSavingDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    InputTextareaModule,
    InputSwitchModule,
    TranslateModule,
  ],
  exports: [DrawSavingDialogComponent],
})
export class DrawSavingDialogModule {}
