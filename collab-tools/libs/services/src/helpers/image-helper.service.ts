import { Injectable, SecurityContext } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Agent, Gadget, Image, StratMap } from '@collab-tools/datamodel';

@Injectable()
export class ImageHelperService {
  constructor(private readonly domSanitizer: DomSanitizer) {}

  getSvgIconByName(iconName: string): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/icons/${iconName}.svg`
    );
  }

  getAgentBadge(agent: Agent): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/agents/${agent.image}`
    );
  }

  getGadgetImage(gadget: Gadget): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/gadgets/${gadget.image}`
    );
  }

  getAgentImageByName(image: string): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/agents/${image}`
    );
  }

  getGadgetImageByName(image: string): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/gadget/${image}`
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

  getFloorImage(imageName: string): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/floors/${imageName}`
    );
  }

  getStratMapImage(stratMap: StratMap): string | null {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/strat-maps/${stratMap?.image}`
    );
  }

  getStratMapImageByName(stratMapImage: string) {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/strat-maps/${stratMapImage}`
    );
  }

  getNoImage() {
    return this.domSanitizer.sanitize(
      SecurityContext.URL,
      `assets/icons/no-image.svg`
    );
  }
}
