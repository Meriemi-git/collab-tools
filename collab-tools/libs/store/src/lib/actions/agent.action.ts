import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Agent } from '@collab-tools/datamodel';

export const FetchAgents = createAction('[Agent] Fetch Agents');

export const FetchAgentsSuccess = createAction(
  '[Agent] Fetch Agents Success',
  props<{ agents: Agent[] }>()
);

export const DragAgent = createAction(
  '[Agent] Drag Agent',
  props<{ agent: Agent }>()
);

export const DragAgentSuccess = createAction('[Agent] Drag Agent success');

export const AddAgent = createAction(
  '[Agent] Add Agent',
  props<{ data: FormData }>()
);

export const AddAgentSuccess = createAction(
  '[Agent] Add Agent Success',
  props<{ agent: Agent }>()
);

export const AgentError = createAction(
  '[Agent] Agent Error',
  props<{ error: HttpErrorResponse }>()
);

export const UpdateAgent = createAction(
  '[Agent] Update Agent',
  props<{ data: FormData }>()
);

export const UpdateAgentSuccess = createAction(
  '[Agent] Update Agent success',
  props<{ agent: Agent }>()
);

export const DeleteAgent = createAction(
  '[Agent] Delete Agent',
  props<{ agentId: string }>()
);

export const DeleteAgentSuccess = createAction(
  '[Agent] Delete Agent success',
  props<{ agentId: string }>()
);
