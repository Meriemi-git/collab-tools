import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Image } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';

@Component({
  selector: 'collab-tools-images-item',
  templateUrl: './images-item.component.html',
})
export class ImagesItemComponent {
  @Input() image: Image;
  @Input() width: number;
  @Output() imageDragged = new EventEmitter<Image>();
  @Output() imageSelected = new EventEmitter<Image>();
  private isDown: boolean;

  constructor(public ihs: ImageHelperService) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown() {
    this.isDown = true;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove() {
    if (this.isDown) {
      this.imageDragged.emit(this.image);
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
