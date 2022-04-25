import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SidenavState } from '../states/sidenav.state';

const sidenavFeature = createFeatureSelector<SidenavState>('SidenavState');

export const isLeftSidenavOpened = createSelector(
  sidenavFeature,
  (state: SidenavState) => state.leftIsOpen
);
export const isRightSidenavOpened = createSelector(
  sidenavFeature,
  (state: SidenavState) => state.rightIsOpen
);
export const isAgentsPanelOpened = createSelector(
  sidenavFeature,
  (state: SidenavState) => state.agentsPanelIsOpen
);
export const isDrawingPanelOpened = createSelector(
  sidenavFeature,
  (state: SidenavState) => state.drawingPanelIsOpen
);
export const isGadgetsPanelOpened = createSelector(
  sidenavFeature,
  (state: SidenavState) => state.gadgetsPanelIsOpen
);
export const isGalleryPanelOpened = createSelector(
  sidenavFeature,
  (state: SidenavState) => state.galleryPanelIsOpen
);

export const isRoomPanelOpened = createSelector(
  sidenavFeature,
  (state: SidenavState) => state.roomPanelIsOpen
);
