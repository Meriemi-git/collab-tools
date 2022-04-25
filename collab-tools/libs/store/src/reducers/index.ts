import { ActionReducerMap } from '@ngrx/store';
import { CanvasState } from '../states/canvas.state';
import { ChatState } from '../states/chat.state';
import { DrawerActionState } from '../states/drawer-action.state';
import { DrawerOptionState } from '../states/drawer-option.state';
import { GalleryState } from '../states/gallery.state';
import { NotificationState } from '../states/notifications.state';
import { RoomState } from '../states/room.state';
import { SidenavState } from '../states/sidenav.state';
import { StratState } from '../states/strat.state';
import { UserState } from '../states/user.state';
import * as canvasReducer from './canvas.reducer';
import * as chatReducer from './chat.reducer';
import * as drawerActionReducer from './drawer-action.reducer';
import * as drawerOptionReducer from './drawer-option.reducer';
import * as galleryReducer from './gallery.reducer';
import * as notifReducer from './notification.reducer';
import * as roomReducer from './room.reducer';
import * as sidenavReducer from './sidenav.reducer';
import * as stratReducer from './strat.reducer';
import * as userReducer from './user.reducer';

export interface StratEditorState {
  CanvasState: CanvasState;
  DrawerActionState: DrawerActionState;
  DrawerOptionState: DrawerOptionState;
  GalleryState: GalleryState;
  NotificationState: NotificationState;
  SidenavState: SidenavState;
  UserState: UserState;
  StratState: StratState;
  RoomState: RoomState;
  ChatState: ChatState;
}

export const reducers: ActionReducerMap<StratEditorState> = {
  CanvasState: canvasReducer.reducer,
  DrawerActionState: drawerActionReducer.reducer,
  DrawerOptionState: drawerOptionReducer.reducer,
  GalleryState: galleryReducer.reducer,
  SidenavState: sidenavReducer.reducer,
  UserState: userReducer.reducer,
  StratState: stratReducer.reducer,
  RoomState: roomReducer.reducer,
  NotificationState: notifReducer.reducer,
  ChatState: chatReducer.reducer,
};
