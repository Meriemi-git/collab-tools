import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Draw } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';

@Component({
  selector: 'collab-tools-draw-item',
  templateUrl: './draw-item.component.html',
  styleUrls: ['./draw-item.component.scss'],
})
export class DrawItemComponent {
  @Input() draw: Draw;
  @Input() itsMine: boolean;
  @Input() liked: boolean;
  @Input() connected: boolean;
  @Output() likeDraw = new EventEmitter<void>();
  @Output() dislikeDraw = new EventEmitter<void>();
  @Output() deleteDraw = new EventEmitter<void>();
  @Output() selectDraw = new EventEmitter<void>();
  public routingEnabled: boolean;
  public onHover: boolean;

  constructor(public ihs: ImageHelperService) {}

  public onSelectDraw() {
    this.selectDraw.emit();
  }
}
