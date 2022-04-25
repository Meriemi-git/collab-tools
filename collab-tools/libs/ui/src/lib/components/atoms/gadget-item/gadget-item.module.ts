import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { GadgetItemComponent } from './gadget-item.component';

@NgModule({
  declarations: [GadgetItemComponent],
  imports: [CommonModule, DividerModule],
  exports: [GadgetItemComponent],
})
export class GadgetItemModule {}
