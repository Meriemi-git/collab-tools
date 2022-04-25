import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ListboxModule } from 'primeng/listbox';
import { RoomListComponent } from './room-list.component';

@NgModule({
  declarations: [RoomListComponent],
  imports: [CommonModule, ListboxModule],
  exports: [RoomListComponent],
})
export class RoomListModule {}
