import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Floor } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';

@Component({
  selector: 'collab-tools-floor-list',
  templateUrl: './floor-list.component.html',
  styleUrls: ['./floor-list.component.scss'],
})
export class FloorListComponent implements OnChanges {
  @Input() floors: Floor[];
  @Input() mapId: string;
  @Output() deleteFloor = new EventEmitter<Floor>();
  @Output() floorSelected = new EventEmitter<Floor>();

  public updatedFloors: Floor[];

  constructor(public ihs: ImageHelperService) {}

  ngOnChanges(_changes: SimpleChanges): void {
    this.updatedFloors = this.floors?.map((floor) => Object.assign({}, floor));
  }

  public onDeleteFloor(floor: Floor, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.deleteFloor.emit(floor);
  }

  public getUpdatedFloors(): Floor[] {
    return this.updatedFloors;
  }

  public onFloorSelected(floor: Floor) {
    this.floorSelected.emit(floor);
  }

  public onValidChecked(event: Event) {
    event.preventDefault();
    event.stopPropagation();
  }
}
