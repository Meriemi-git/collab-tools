import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ColorPickerModule } from 'primeng/colorpicker';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { SelectButtonModule } from 'primeng/selectbutton';
import { SliderModule } from 'primeng/slider';
import { PipesModule } from '../../../../lib/pipes.module';
import { DrawingActionModule } from '../../atoms/drawing-action/drawing-action.module';
import { SvgIconModule } from '../../atoms/svg-icon/svg-icon.module';
import { DrawingPanelComponent } from './drawing-panel.component';

@NgModule({
  declarations: [DrawingPanelComponent],
  imports: [
    CommonModule,
    FormsModule,
    DrawingActionModule,
    PipesModule,
    DividerModule,
    ColorPickerModule,
    SliderModule,
    SelectButtonModule,
    DropdownModule,
    SvgIconModule,
    TranslateModule,
  ],
  exports: [DrawingPanelComponent],
})
export class DrawingPanelModule {}
