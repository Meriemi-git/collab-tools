import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Image } from '@collab-tools/datamodel';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'collab-tools-images-grid',
  templateUrl: './images-grid.component.html',
  styleUrls: ['./images-grid.component.scss'],
})
export class ImagesGridComponent {
  @Input() images: Image[];
  @Input() isPendingForSelection: boolean;
  @Output() imageDragged = new EventEmitter<Image>();
  @Output() imageDeleted = new EventEmitter<Image>();

  constructor(private readonly confirmationService: ConfirmationService) {}

  public getThirdLength(): number {
    const thirdHeight = Math.ceil(
      this.images.reduce((total, image) => total + image.thumbHeight, 0) / 3
    );
    let halfLength = 0;
    let sumHeight = 0;
    this.images.forEach((image) => {
      if (sumHeight < thirdHeight) {
        halfLength++;
        sumHeight += image.thumbHeight;
      }
    });
    return halfLength;
  }

  public getTwoThirdLength(): number {
    const thirdHeight = Math.ceil(
      this.images.reduce((total, image) => total + image.thumbHeight, 0) / 3
    );
    let halfLength = 0;
    let sumHeight = 0;
    this.images.forEach((image) => {
      if (sumHeight < thirdHeight * 2) {
        halfLength++;
        sumHeight += image.thumbHeight;
      }
    });
    return halfLength;
  }

  public onImageDragged(image: Image) {
    this.imageDragged.emit(image);
  }

  public onDelete(image: Image) {
    this.confirmationService.confirm({
      message: 'Confirm deletion ?',
      icon: 'pi pi-exclamation-triangle',
      key: 'delete-image-popup',
      accept: () => {
        this.imageDeleted.emit(image);
      },
    });
  }
}
