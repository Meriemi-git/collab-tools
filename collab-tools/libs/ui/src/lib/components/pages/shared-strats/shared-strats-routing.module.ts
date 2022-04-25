import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedStratsComponent } from './shared-strats.component';

export const routes: Routes = [{ path: '', component: SharedStratsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedStratsRoutingModule {}
