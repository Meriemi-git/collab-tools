import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawingMode, DrawingToolbarAction } from '@collab-tools/datamodel';

@Component({
  selector: 'collab-tools-drawing-toolbar',
  templateUrl: './drawing-toolbar.component.html',
})
export class DrawingToolbarComponent {
  @Input() isConfirmed: boolean;
  @Input() canBeDeleted: boolean;
  @Output() selectedAction = new EventEmitter<DrawingToolbarAction>();

  public DrawingModeEnum = DrawingMode;

  public DrawingActions = DrawingToolbarAction;
}
