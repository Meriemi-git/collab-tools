import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/gadget.reducer';
import { GadgetState } from '../states/gadget.state';

const gadgetFeature = createFeatureSelector<GadgetState>('GadgetState');
export const selectGadgetState = createSelector(
  gadgetFeature,
  (state: GadgetState) => state
);

export const getAllGadgets = createSelector(gadgetFeature, selectAll);
