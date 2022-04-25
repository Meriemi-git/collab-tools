import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageHelperService } from '@collab-tools/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { StratItemComponent } from './strat-item.component';

@NgModule({
  declarations: [StratItemComponent],
  imports: [CommonModule, SvgIconModule, CardModule, ButtonModule, ChipModule],
  exports: [StratItemComponent],
  providers: [ImageHelperService],
})
export class StratItemModule {}
