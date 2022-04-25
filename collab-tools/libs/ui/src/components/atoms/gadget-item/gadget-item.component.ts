import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Gadget } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';

@Component({
  selector: 'collab-tools-gadget-item',
  templateUrl: './gadget-item.component.html',
})
export class GadgetItemComponent {
  @Input() gadget: Gadget;
  @Output() gadgetDragged = new EventEmitter<Gadget>();
  private isDown: boolean;

  constructor(public readonly ihs: ImageHelperService) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown() {
    this.isDown = true;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove() {
    if (this.isDown) {
      this.gadgetDragged.emit(this.gadget);
      this.isDown = false;
    }
  }

  @HostListener('mouseup', ['$event'])
  onMouseUp() {
    this.isDown = false;
  }

  @HostListener('mouseout', ['$event'])
  onMouseOut() {
    this.isDown = false;
  }
}
