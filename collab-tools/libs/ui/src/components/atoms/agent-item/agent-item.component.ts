import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { Agent } from '@collab-tools/datamodel';
import { ImageHelperService } from '@collab-tools/services';

@Component({
  selector: 'collab-tools-agent-item',
  templateUrl: './agent-item.component.html',
  styleUrls: ['./agent-item.component.scss'],
})
export class AgentItemComponent {
  @Input() agent: Agent;
  @Output() agentDragged = new EventEmitter<Agent>();
  private isDown: boolean;

  constructor(public readonly ihs: ImageHelperService) {}

  @HostListener('mousedown', ['$event'])
  onMouseDown() {
    this.isDown = true;
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove() {
    if (this.isDown) {
      this.agentDragged.emit(this.agent);
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
