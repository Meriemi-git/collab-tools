import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/agent.reducer';
import { AgentState } from '../states/agent.state';

const agentFeature = createFeatureSelector<AgentState>('AgentState');
export const selectAgentState = createSelector(
  agentFeature,
  (state: AgentState) => state
);

export const getAllAgents = createSelector(agentFeature, selectAll);

export const getDraggedAgent = createSelector(
  selectAgentState,
  (state: AgentState) => state.dragged
);
