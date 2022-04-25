import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { GadgetPanelComponent } from './gadget-panel.component';

@NgModule({
  declarations: [GadgetPanelComponent],
  imports: [CommonModule, TranslateModule],
  exports: [GadgetPanelComponent],
})
export class GadgetPanelModule {}
