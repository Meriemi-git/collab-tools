import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StratMap } from '@collab-tools/datamodel';
@Component({
  selector: 'collab-tools-map-grid',
  templateUrl: './map-grid.component.html',
  styleUrls: ['./map-grid.component.scss'],
})
export class StratMapGridComponent {
  @Input() maps: StratMap[];
  @Output() selectStratMap = new EventEmitter<StratMap>();

  onSelectStratMap(map: StratMap) {
    this.selectStratMap.emit(map);
  }
}
