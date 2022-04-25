import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageHelperService } from '@collab-tools/services';
import { SidebarModule } from 'primeng/sidebar';
import { DrawingPanelModule } from '../drawing-panel/drawing-panel.module';
import { GalleryPanelModule } from '../gallery-panel/gallery-panel.module';
import { RoomPanelModule } from '../room-panel/room-panel.module';
import { RightPanelComponent } from './right-panel.component';

@NgModule({
  declarations: [RightPanelComponent],
  imports: [
    CommonModule,
    DrawingPanelModule,
    GalleryPanelModule,
    SidebarModule,
    RoomPanelModule,
  ],
  providers: [ImageHelperService],
  exports: [RightPanelComponent],
})
export class RightPanelModule {}
