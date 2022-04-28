import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DrawerModule } from '@collab-tools/drawer';
import { ImageHelperService } from '@collab-tools/services';
import { TranslateModule } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { PipesModule } from '../../../lib/pipes.module';
import { DrawingStatusModule } from '../../atoms/drawing-status/drawing-status.module';
import { DrawingToolbarModule } from '../../atoms/drawing-toolbar/drawing-toolbar.module';
import { SvgIconModule } from '../../atoms/svg-icon/svg-icon.module';
import { DrawSavingDialogModule } from '../../molecules/draw-saving-dialog/draw-saving-dialog.module';
import { LeftPanelModule } from '../../molecules/left-panel/left-panel.module';
import { RightPanelModule } from '../../molecules/right-panel/right-panel.module';
import { EditorRoutingModule } from './editor-routing.module';
import { EditorComponent } from './editor.component';
@NgModule({
  declarations: [EditorComponent],
  imports: [
    CommonModule,
    EditorRoutingModule,
    DrawerModule,
    DrawingStatusModule,
    DrawerModule,
    DrawingToolbarModule,
    ConfirmDialogModule,
    TooltipModule,
    SvgIconModule,
    SidebarModule,
    ButtonModule,
    RightPanelModule,
    LeftPanelModule,
    PipesModule,
    DynamicDialogModule,
    DrawSavingDialogModule,
    TranslateModule,
  ],
  providers: [ImageHelperService],
  exports: [EditorComponent],
})
export class EditorModule {}
