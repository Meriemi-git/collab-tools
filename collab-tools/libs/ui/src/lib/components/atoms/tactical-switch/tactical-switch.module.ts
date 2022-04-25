import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputSwitchModule } from 'primeng/inputswitch';
import { TacticalSwitchComponent } from './tactical-switch.component';

@NgModule({
  declarations: [TacticalSwitchComponent],
  imports: [CommonModule, InputSwitchModule, FormsModule, TranslateModule],
  exports: [TacticalSwitchComponent],
})
export class TacticalSwitchModule {}
