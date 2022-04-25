import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CanActivateEditorGuard } from '../../../guards/can-activate-editor-guard';
import { CanLeaveEditorGuard } from '../../../guards/can-leave-editor-guard';
import { EditorComponent } from './editor.component';

export const routes: Routes = [
  {
    path: '',
    component: EditorComponent,
    canDeactivate: [CanLeaveEditorGuard],
    canActivate: [CanActivateEditorGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditorRoutingModule {}
