import { Component, Input } from '@angular/core';
import { Room } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-room-list',
  templateUrl: './room-list.component.html',
  styleUrls: ['./room-list.component.scss'],
})
export class RoomListComponent {
  @Input() rooms: Room[];
}
