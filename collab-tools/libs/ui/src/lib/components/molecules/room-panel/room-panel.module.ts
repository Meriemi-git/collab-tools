import { ClipboardModule } from '@angular/cdk/clipboard';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { WebsocketModule } from '@collab-tools/websocket';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { ListboxModule } from 'primeng/listbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { RoomJoinerModule } from '../room-joiner/room-joiner.module';
import { UserFinderModule } from '../user-finder/user-finder.module';
import { RoomPanelComponent } from './room-panel.component';
@NgModule({
  declarations: [RoomPanelComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    DividerModule,
    ReactiveFormsModule,
    ClipboardModule,
    ListboxModule,
    ChipModule,
    ScrollPanelModule,
    RoomJoinerModule,
    WebsocketModule,
    TranslateModule,
    ConfirmDialogModule,
    ConfirmPopupModule,
    UserFinderModule,
  ],
  exports: [RoomPanelComponent],
})
export class RoomPanelModule {}
