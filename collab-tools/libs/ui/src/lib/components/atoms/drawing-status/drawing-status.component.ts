import { Component, Input } from '@angular/core';
import { DrawingMode } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-drawing-status',
  templateUrl: './drawing-status.component.html',
  styleUrls: ['./drawing-status.component.scss'],
})
export class DrawingStatusComponent {
  @Input() drawingMode: DrawingMode;
  public DrawingModeEnum = DrawingMode;
}
