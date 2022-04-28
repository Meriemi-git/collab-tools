import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PipesModule } from '../../../lib/pipes.module';
import { ImagesItemModule } from '../../atoms/images-item/images-item.module';
import { ImagesGridComponent } from './images-grid.component';
@NgModule({
  declarations: [ImagesGridComponent],
  imports: [CommonModule, PipesModule, ImagesItemModule, ConfirmDialogModule],
  exports: [ImagesGridComponent],
})
export class ImagesGridModule {}
