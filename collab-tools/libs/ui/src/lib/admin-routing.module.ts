import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './components/pages/not-found/not-found.component';
import { CanAccessAdminGuard } from './guards/can-access-admin-guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [CanAccessAdminGuard],
    loadChildren: () =>
      import('./components/pages/admin/admin.module').then(
        (mod) => mod.AdminModule
      ),
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
