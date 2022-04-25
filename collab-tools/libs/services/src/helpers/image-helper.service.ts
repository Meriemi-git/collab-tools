import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Image } from '@collab-tools/datamodel';

@Injectable()
export class ImageHelperService {
  constructor(private readonly domSanitizer: DomSanitizer) {}

  getSvgIconByName(iconName: string): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/icons/${iconName}.svg`
    );
  }

  getGalleryImage(image: Image): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/uploads/images/${image.fileName}`
    );
  }

  getGalleryThumb(image: Image): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/uploads/thumbs/thumb-${image.fileName}`
    );
  }

  getNoImage() {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/icons/no-image.svg`
    );
  }
}
