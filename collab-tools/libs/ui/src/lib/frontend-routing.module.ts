import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../components/pages/home/home.module').then(
        (mod) => mod.HomeModule
      ),
  },
  {
    path: 'editor',
    loadChildren: () =>
      import('../components/pages/editor/editor.module').then(
        (mod) => mod.EditorModule
      ),
  },
  {
    path: 'confirmation/:token',
    loadChildren: () =>
      import('../components/pages/confirmation/confirmation.module').then(
        (mod) => mod.ConfirmationModule
      ),
  },
  {
    path: 'account',
    loadChildren: () =>
      import('../components/pages/account/account.module').then(
        (mod) => mod.AccountModule
      ),
  },
  {
    path: 'room/:roomId',
    loadChildren: () =>
      import('../components/pages/room/room.module').then(
        (mod) => mod.RoomModule
      ),
  },
  {
    path: 'room',
    loadChildren: () =>
      import('../components/pages/room/room.module').then(
        (mod) => mod.RoomModule
      ),
  },
  {
    path: 'notifications',
    loadChildren: () =>
      import('../components/pages/notifications/notifications.module').then(
        (mod) => mod.NotificationsModule
      ),
  },
  {
    path: 'maintenance',
    loadChildren: () =>
      import('../components/pages/maintenance/maintenance.module').then(
        (mod) => mod.MaintenanceModule
      ),
  },
  {
    path: '**',
    loadChildren: () =>
      import('../components/pages/not-found/not-found.module').then(
        (mod) => mod.NotFoundModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class FrontendRoutingModule {}
