import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule } from 'primeng/accordion';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { ImagesGridModule } from '../images-grid/images-grid.module';
import { GalleryPanelComponent } from './gallery-panel.component';

@NgModule({
  declarations: [GalleryPanelComponent],
  imports: [
    CommonModule,
    ImagesGridModule,
    FileUploadModule,
    DividerModule,
    ButtonModule,
    TranslateModule,
    AccordionModule,
    InputTextModule,
    FormsModule,
    FieldsetModule,
  ],
  exports: [GalleryPanelComponent],
})
export class GalleryPanelModule {}
