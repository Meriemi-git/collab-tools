import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MultiSelectModule } from 'primeng/multiselect';
import { PipesModule } from '../../../pipes.module';
import { AgentItemModule } from '../agent-item/agent-item.module';
import { AddAgentComponent } from './add-agent.component';
@NgModule({
  declarations: [AddAgentComponent],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    FileUploadModule,
    DropdownModule,
    InputTextareaModule,
    AgentItemModule,
    ConfirmDialogModule,
    ReactiveFormsModule,
    PipesModule,
    MultiSelectModule,
    TranslateModule,
  ],
  exports: [AddAgentComponent],
  providers: [ConfirmationService],
})
export class AddAgentModule {}
