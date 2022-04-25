import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DrawerModule } from '@collab-tools/drawer';
import { WebsocketModule } from '@collab-tools/websocket';
import { ButtonModule } from 'primeng/button';
import { LoadingModule } from '../../atoms/loading/loading.module';
import { RoomJoinerModule } from '../../molecules/room-joiner/room-joiner.module';
import { RoomRoutingModule } from './room-routing.module';
import { RoomComponent } from './room.component';

@NgModule({
  declarations: [RoomComponent],
  imports: [
    CommonModule,
    RoomRoutingModule,
    DrawerModule,
    RoomJoinerModule,
    WebsocketModule,
    ButtonModule,
    TranslateModule,
    LoadingModule,
  ],
  exports: [RoomComponent],
})
export class RoomModule {}
