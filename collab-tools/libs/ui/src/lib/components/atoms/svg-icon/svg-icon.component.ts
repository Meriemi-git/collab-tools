import { Component, Input } from '@angular/core';
import { ImageHelperService } from '@collab-tools/services';

@Component({
  selector: 'collab-tools-svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss'],
})
export class SvgIconComponent {
  @Input() name: string;
  @Input() width: string;
  @Input() height: string;
  @Input() color: string;

  constructor(public readonly ihs: ImageHelperService) {}
}
