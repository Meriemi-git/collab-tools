import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance.component';

@NgModule({
  declarations: [MaintenanceComponent],
  imports: [CommonModule, MaintenanceRoutingModule, TranslateModule],
  exports: [MaintenanceComponent],
})
export class MaintenanceModule {}
