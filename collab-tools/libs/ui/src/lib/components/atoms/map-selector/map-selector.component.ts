import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StratMap } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-map-selector',
  templateUrl: './map-selector.component.html',
  styleUrls: ['./map-selector.component.scss'],
})
export class StratMapSelectorComponent {
  @Input()
  public maps: StratMap[];
  @Input()
  public readOnly: boolean;
  @Input()
  public selectedStratMap: StratMap;
  @Output()
  mapSelected = new EventEmitter<StratMap>();

  onStratMapSelected(map: StratMap) {
    this.mapSelected.emit(map);
  }

  public forceStratMapSelection(stratMap: StratMap) {
    this.selectedStratMap = stratMap;
  }
}
