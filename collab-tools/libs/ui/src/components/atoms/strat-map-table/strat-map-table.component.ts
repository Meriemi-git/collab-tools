import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Floor, StratMap } from '@collab-tools/datamodel';
@Component({
  selector: 'collab-tools-strat-map-table',
  templateUrl: './strat-map-table.component.html',
  styleUrls: ['./strat-map-table.component.scss'],
})
export class StratMapTableComponent {
  @Input() stratMaps: StratMap[];
  @Output() stratMapSelected = new EventEmitter<StratMap>();
  @Output() floorSelected = new EventEmitter<Floor>();

  public displayedColumns: string[] = [
    'name',
    'year',
    'season',
    'floors',
    'select',
  ];

  public selectStratMap(stratMap: StratMap) {
    this.stratMapSelected.emit(
      Object.assign(
        {},
        {
          ...stratMap,
          floors: stratMap.floors?.map((floor) => Object.assign({}, floor)),
        }
      )
    );
  }

  public onFloorSelected(floor: Floor, stratMap: StratMap) {
    this.stratMapSelected.emit(stratMap);
    this.floorSelected.emit(floor);
  }
}
