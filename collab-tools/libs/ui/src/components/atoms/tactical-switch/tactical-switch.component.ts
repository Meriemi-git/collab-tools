import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'collab-tools-tactical-switch',
  templateUrl: './tactical-switch.component.html',
})
export class TacticalSwitchComponent {
  @Input() tacticalMode: boolean;
  @Output() setTacticalMode = new EventEmitter<boolean>();

  onSetTacticalMode(isChecked: boolean) {
    this.setTacticalMode.emit(isChecked);
  }
}
