import { ActionReducerMap } from '@ngrx/store';
import { AgentState } from '../states/agent.state';
import { CanvasState } from '../states/canvas.state';
import { DrawerActionState } from '../states/drawer-action.state';
import { DrawerOptionState } from '../states/drawer-option.state';
import { GadgetState } from '../states/gadget.state';
import { GalleryState } from '../states/gallery.state';
import { NotificationState } from '../states/notifications.state';
import { RoomState } from '../states/room.state';
import { SidenavState } from '../states/sidenav.state';
import { StratMapState } from '../states/strat-map.state';
import { StratState } from '../states/strat.state';
import { UserState } from '../states/user.state';
import { ChatState } from '../states/chat.state';
import * as agentReducer from './agent.reducer';
import * as canvasReducer from './canvas.reducer';
import * as drawerActionReducer from './drawer-action.reducer';
import * as drawerOptionReducer from './drawer-option.reducer';
import * as gadgetReducer from './gadget.reducer';
import * as galleryReducer from './gallery.reducer';
import * as notifReducer from './notification.reducer';
import * as roomReducer from './room.reducer';
import * as sidenavReducer from './sidenav.reducer';
import * as stratMapReducer from './strat-map.reducer';
import * as stratReducer from './strat.reducer';
import * as userReducer from './user.reducer';
import * as chatReducer from './chat.reducer';

export interface StratEditorState {
  AgentState: AgentState;
  GadgetState: GadgetState;
  CanvasState: CanvasState;
  DrawerActionState: DrawerActionState;
  DrawerOptionState: DrawerOptionState;
  GalleryState: GalleryState;
  NotificationState: NotificationState;
  StratMapState: StratMapState;
  SidenavState: SidenavState;
  UserState: UserState;
  StratState: StratState;
  RoomState: RoomState;
  ChatState: ChatState;
}

export const reducers: ActionReducerMap<StratEditorState> = {
  AgentState: agentReducer.reducer,
  GadgetState: gadgetReducer.reducer,
  CanvasState: canvasReducer.reducer,
  DrawerActionState: drawerActionReducer.reducer,
  DrawerOptionState: drawerOptionReducer.reducer,
  GalleryState: galleryReducer.reducer,
  StratMapState: stratMapReducer.reducer,
  SidenavState: sidenavReducer.reducer,
  UserState: userReducer.reducer,
  StratState: stratReducer.reducer,
  RoomState: roomReducer.reducer,
  NotificationState: notifReducer.reducer,
  ChatState: chatReducer.reducer,
};
