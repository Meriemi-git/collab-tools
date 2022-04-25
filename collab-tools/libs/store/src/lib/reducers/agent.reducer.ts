import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import { Agent } from '@collab-tools/datamodel';
import * as actions from '../actions/agent.action';
import { AgentState } from '../states/agent.state';

export const adapter: EntityAdapter<Agent> = createEntityAdapter<Agent>({
  sortComparer: sortByName,
  selectId: (agent: Agent) => agent._id,
});

export function sortByName(a: Agent, b: Agent): number {
  return a.name.localeCompare(b.name);
}

export const initialstate: AgentState = adapter.getInitialState({
  error: null,
  dragged: null,
});

const agentReducer = createReducer(
  initialstate,
  on(actions.FetchAgentsSuccess, (state, { agents }) => {
    return adapter.addMany(agents, { ...state, error: null });
  }),
  on(actions.AgentError, (state, { error }) => ({
    ...state,
    loaded: false,
    error: error,
  })),
  on(actions.DragAgent, (state, { agent }) => ({
    ...state,
    dragged: agent,
  })),
  on(actions.DragAgentSuccess, (state) => ({
    ...state,
    dragged: null,
  })),
  on(actions.AddAgentSuccess, (state, { agent }) => {
    return adapter.addOne(agent, { ...state, error: null });
  }),
  on(actions.UpdateAgentSuccess, (state, { agent }) => {
    return adapter.updateOne(
      { id: agent._id, changes: agent },
      { ...state, error: null }
    );
  }),
  on(actions.DeleteAgentSuccess, (state, { agentId }) => {
    return adapter.removeOne(agentId, {
      ...state,
      error: null,
    });
  })
);

export function reducer(state: AgentState | undefined, action: Action) {
  return agentReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();
