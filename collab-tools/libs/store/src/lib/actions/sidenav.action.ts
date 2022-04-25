import { createAction } from '@ngrx/store';

export const toggleLeft = createAction('[Sidenav] Toggle Left Sidenav');
export const closeLeft = createAction('[Sidenav] Close Left Sidenav');
export const toggleRight = createAction('[Sidenav] Toggle Right Sidenav');
export const closeRight = createAction('[Sidenav] Close Right Sidenav');

export const showAgentsPanel = createAction('[Sidenav] Show Agents Panel');
export const showGadgetsPanel = createAction('[Sidenav] Show Gadgets Panel');
export const showDrawingPanel = createAction('[Sidenav] Show Drawing Panel');
export const showGalleryPanel = createAction('[Sidenav] Show Gallery Panel');
export const showRoomPanel = createAction('[Sidenav] Show Room Panel');
