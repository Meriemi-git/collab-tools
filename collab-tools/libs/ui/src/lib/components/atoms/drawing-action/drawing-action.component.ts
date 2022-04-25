import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DrawerAction } from '@collab-tools/datamodel';
@Component({
  selector: 'collab-tools-drawing-action',
  templateUrl: './drawing-action.component.html',
  styleUrls: ['./drawing-action.component.scss'],
})
export class DrawingActionComponent {
  @Input() action: DrawerAction;
  @Output() actionSelected = new EventEmitter<DrawerAction>();

  onClick() {
    this.actionSelected.emit(this.action);
  }
}
