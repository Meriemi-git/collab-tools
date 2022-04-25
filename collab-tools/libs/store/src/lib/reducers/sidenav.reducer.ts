import { Action, createReducer, on } from '@ngrx/store';
import * as actions from '../actions/sidenav.action';
import { SidenavState } from '../states/sidenav.state';

export const initialstate: SidenavState = {
  rightIsOpen: false,
  leftIsOpen: false,
  agentsPanelIsOpen: false,
  gadgetsPanelIsOpen: false,
  drawingPanelIsOpen: false,
  galleryPanelIsOpen: false,
  roomPanelIsOpen: false,
};

const sidenavReducer = createReducer(
  initialstate,
  on(actions.toggleLeft, (state) => ({
    ...state,
    leftIsOpen: !state.leftIsOpen,
  })),
  on(actions.toggleRight, (state) => ({
    ...state,
    rightIsOpen: !state.rightIsOpen,
  })),
  on(actions.closeRight, (state) => ({
    ...state,
    rightIsOpen: false,
    agentsPanelIsOpen: false,
    gadgetsPanelIsOpen: false,
    drawingPanelIsOpen: false,
    galleryPanelIsOpen: false,
    roomPanelIsOpen: false,
  })),
  on(actions.closeLeft, (state) => ({
    ...state,
    leftIsOpen: false,
    agentsPanelIsOpen: false,
    gadgetsPanelIsOpen: false,
    drawingPanelIsOpen: false,
    galleryPanelIsOpen: false,
    roomPanelIsOpen: false,
  })),
  on(actions.showAgentsPanel, (state) => ({
    ...state,
    leftIsOpen: true,
    rightIsOpen: false,
    agentsPanelIsOpen: true,
    gadgetsPanelIsOpen: false,
    drawingPanelIsOpen: false,
    galleryPanelIsOpen: false,
    roomPanelIsOpen: false,
  })),

  on(actions.showGadgetsPanel, (state) => ({
    ...state,
    leftIsOpen: true,
    rightIsOpen: false,
    agentsPanelIsOpen: false,
    gadgetsPanelIsOpen: true,
    drawingPanelIsOpen: false,
    galleryPanelIsOpen: false,
    roomPanelIsOpen: false,
  })),
  on(actions.showDrawingPanel, (state) => ({
    ...state,
    leftIsOpen: false,
    rightIsOpen: true,
    agentsPanelIsOpen: false,
    gadgetsPanelIsOpen: false,
    drawingPanelIsOpen: true,
    galleryPanelIsOpen: false,
    roomPanelIsOpen: false,
  })),
  on(actions.showGalleryPanel, (state) => ({
    ...state,
    leftIsOpen: false,
    rightIsOpen: true,
    agentsPanelIsOpen: false,
    gadgetsPanelIsOpen: false,
    drawingPanelIsOpen: false,
    galleryPanelIsOpen: true,
    roomPanelIsOpen: false,
  })),
  on(actions.showRoomPanel, (state) => ({
    ...state,
    leftIsOpen: false,
    rightIsOpen: true,
    agentsPanelIsOpen: false,
    gadgetsPanelIsOpen: false,
    drawingPanelIsOpen: false,
    galleryPanelIsOpen: false,
    roomPanelIsOpen: true,
  }))
);

export function reducer(state: SidenavState | undefined, action: Action) {
  return sidenavReducer(state, action);
}
