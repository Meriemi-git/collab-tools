import { HttpErrorResponse } from '@angular/common/http';
import { EntityState } from '@ngrx/entity';
import { Agent } from '@collab-tools/datamodel';

export interface AgentState extends EntityState<Agent> {
  error: HttpErrorResponse;
  dragged: Agent;
}
