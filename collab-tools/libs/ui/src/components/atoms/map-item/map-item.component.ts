import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StratMap as StratStratMap } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';
@Component({
  selector: 'collab-tools-map-item',
  templateUrl: './map-item.component.html',
  styleUrls: ['./map-item.component.scss'],
})
export class StratMapItemComponent {
  @Input() map: StratStratMap;
  @Output() selectStratMap = new EventEmitter<StratStratMap>();
  public onHover: boolean;
  constructor(public readonly ihs: ImageHelperService) {}
}
