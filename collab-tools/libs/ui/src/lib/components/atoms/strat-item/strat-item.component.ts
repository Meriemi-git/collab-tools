import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Strat, StratMap } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';

@Component({
  selector: 'collab-tools-strat-item',
  templateUrl: './strat-item.component.html',
  styleUrls: ['./strat-item.component.scss'],
})
export class StratItemComponent {
  @Input() strat: Strat;
  @Input() itsMine: boolean;
  @Input() liked: boolean;
  @Input() connected: boolean;
  @Output() likeStrat = new EventEmitter<void>();
  @Output() dislikeStrat = new EventEmitter<void>();
  @Output() deleteStrat = new EventEmitter<void>();
  @Output() selectStrat = new EventEmitter<void>();
  public stratMapImage: StratMap;
  public routingEnabled: boolean;
  public onHover: boolean;

  constructor(public ihs: ImageHelperService) {}

  public onSelectStrat() {
    this.selectStrat.emit();
  }
}
