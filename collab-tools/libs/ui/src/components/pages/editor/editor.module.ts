import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DrawerModule } from '@collab-tools/drawer';
import { ImageHelperService } from '@collab-tools/services';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SidebarModule } from 'primeng/sidebar';
import { TooltipModule } from 'primeng/tooltip';
import { PipesModule } from '../../../pipes.module';
import { DrawingStatusModule } from '../../atoms/drawing-status/drawing-status.module';
import { DrawingToolbarModule } from '../../atoms/drawing-toolbar/drawing-toolbar.module';
import { LayerSelectorModule } from '../../atoms/layer-selector/layer-selector.module';
import { StratMapSelectorModule } from '../../atoms/map-selector/map-selector.module';
import { SvgIconModule } from '../../atoms/svg-icon/svg-icon.module';
import { TacticalSwitchModule } from '../../atoms/tactical-switch/tactical-switch.module';
import { LeftPanelModule } from '../../molecules/left-panel/left-panel.module';
import { RightPanelModule } from '../../molecules/right-panel/right-panel.module';
import { StratSavingDialogModule } from '../../molecules/strat-saving-dialog/strat-saving-dialog.module';
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
        TacticalSwitchModule,
        SidebarModule,
        ButtonModule,
        RightPanelModule,
        LeftPanelModule,
        LayerSelectorModule,
        StratMapSelectorModule,
        PipesModule,
        DynamicDialogModule,
        StratSavingDialogModule,
        TranslateModule,
    ],
    providers: [ImageHelperService],
    exports: [EditorComponent]
})
export class EditorModule {}
