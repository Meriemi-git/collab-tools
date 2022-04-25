import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageHelperService } from '@collab-tools/services';
import { StratMapItemComponent } from './map-item.component';

@NgModule({
  declarations: [StratMapItemComponent],
  imports: [CommonModule],
  exports: [StratMapItemComponent],
  providers: [ImageHelperService],
})
export class StratMapItemModule {}
