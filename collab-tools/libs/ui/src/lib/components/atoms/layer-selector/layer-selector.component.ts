import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Layer } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-layer-selector',
  templateUrl: './layer-selector.component.html',
  styleUrls: ['./layer-selector.component.scss'],
})
export class LayerSelectorComponent {
  @Input()
  public layers: Layer[];
  @Input()
  public selectedLayer: Layer;
  @Output()
  public layerSelected = new EventEmitter<Layer>();

  public onLayerSelected(layer: Layer) {
    this.layerSelected.emit(layer);
  }
}
