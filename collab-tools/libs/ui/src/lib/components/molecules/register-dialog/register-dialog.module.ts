import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { LangSelectorModule } from '../../atoms/lang-selector/lang-selector.module';
import { RegisterDialogComponent } from './register-dialog.component';

@NgModule({
  declarations: [RegisterDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TriStateCheckboxModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    TranslateModule,
    LangSelectorModule,
  ],
  exports: [RegisterDialogComponent],
})
export class RegisterDialogModule {}
