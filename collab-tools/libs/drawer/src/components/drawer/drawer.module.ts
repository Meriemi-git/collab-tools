import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageHelperService } from '@collab-tools/services';
import { DrawerComponent } from './drawer.component';

@NgModule({
  imports: [CommonModule],
  declarations: [DrawerComponent],
  exports: [DrawerComponent],
  providers: [ImageHelperService],
})
export class DrawerModule {}
