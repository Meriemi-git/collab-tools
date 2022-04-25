import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { StratItemModule } from '../../atoms/strat-item/strat-item.module';
import { StratGridComponent } from './strat-grid.component';

@NgModule({
  declarations: [StratGridComponent],
  imports: [CommonModule, StratItemModule, TranslateModule],
  exports: [StratGridComponent],
})
export class StratGridModule {}
