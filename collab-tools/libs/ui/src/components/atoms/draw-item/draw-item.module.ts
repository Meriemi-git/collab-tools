import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ImageHelperService } from '@collab-tools/services';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { DrawItemComponent } from './strat-item.component';

@NgModule({
  declarations: [DrawItemComponent],
  imports: [CommonModule, SvgIconModule, CardModule, ButtonModule, ChipModule],
  exports: [DrawItemComponent],
  providers: [ImageHelperService],
})
export class DrawItemModule {}
