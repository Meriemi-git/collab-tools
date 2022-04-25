import { HttpErrorResponse } from '@angular/common/http';
import { createAction, props } from '@ngrx/store';
import { Chat, ChatMessage, WebsocketStatus } from '@collab-tools/datamodel';

export const GetAllChats = createAction('[Chat] Get All Chats');

export const GetAllChatsSuccess = createAction(
  '[Chat] Get All Chats Success',
  props<{ chats: Chat[] }>()
);

export const CreateChat = createAction(
  '[Chat] Create Chat',
  props<{ members: string[] }>()
);

export const JoinChat = createAction(
  '[Chat] Join Chat',
  props<{ chatId: string }>()
);

export const JoinChatSuccess = createAction(
  '[Chat] Join Chat Success',
  props<{ chat: Chat }>()
);

export const SelectChat = createAction(
  '[Chat] Select Chat',
  props<{ chatId: string }>()
);

export const CloseCurrentChat = createAction(
  '[Chat] Close Current Chat',
  props<{ chatId: string }>()
);
export const CloseCurrentChatSuccess = createAction(
  '[Chat] Close Current Chat Success',
  props<{ chatId: string }>()
);

export const CreateChatSuccess = createAction(
  '[Chat] Create Chat Success',
  props<{ chat: Chat }>()
);

export const SendChatMessage = createAction(
  '[Chat] Send Chat Message',
  props<{ chatId: string; content: string }>()
);

export const SendChatMessageSuccess = createAction(
  '[Chat] Send Chat Message success',
  props<{ chatId: string; chatMessage: ChatMessage }>()
);

export const LeaveChat = createAction(
  '[Chat] Leave Chat',
  props<{ chatId: string }>()
);

export const LeaveChatSuccess = createAction(
  '[Chat] Leave Chat Success',
  props<{ chatId: string }>()
);

export const ChatError = createAction(
  '[Chat] Chat Error',
  props<{ error: HttpErrorResponse }>()
);

export const InviteUsersToChat = createAction(
  '[Chat] Invite Users to Chat',
  props<{ usernames: string[]; chatId: string }>()
);

export const InviteUsersToChatSuccess = createAction(
  '[Chat] Invite users to Chat success',
  props<{ chat: Chat }>()
);

export const GetLastChatMessages = createAction(
  '[Chat] Get Last Chat messages',
  props<{ chatId: string; time: Date }>()
);

export const GetLastChatMessagesSuccess = createAction(
  '[Chat] Get Last Chat messages sucess',
  props<{ chatMessages: ChatMessage[]; chatId: string }>()
);

export const AddMessageToList = createAction(
  '[Chat] Add message to list',
  props<{ chatMessage: ChatMessage; chatId: string }>()
);

export const ReceiveUnreadMessage = createAction(
  '[Chat] Receive Unread Message',
  props<{ chatId: string }>()
);

export const UpdateChatMemberStatus = createAction(
  '[Chat] Update ChatMember Status',
  props<{
    chatMemberId: string;
    status: WebsocketStatus;
    chatId: string;
  }>()
);
