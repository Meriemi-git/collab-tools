import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyStratsComponent } from './my-strats.component';

export const routes: Routes = [{ path: '', component: MyStratsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyStratsRoutingModule {}
