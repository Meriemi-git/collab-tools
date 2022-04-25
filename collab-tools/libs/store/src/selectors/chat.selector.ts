import { createFeatureSelector, createSelector } from '@ngrx/store';
import { selectAll } from '../reducers/chat.reducer';
import { ChatState } from '../states/chat.state';

const chatFeature = createFeatureSelector<ChatState>('ChatState');
export const selectChatState = createSelector(
  chatFeature,
  (state: ChatState) => state
);

export const getAllChats = createSelector(selectChatState, selectAll);

export const getCurrentChat = createSelector(
  selectChatState,
  (state: ChatState) => state.entities[state.currentChatId]
);

export const getChatMessages = (chatId: string) =>
  createSelector(getAllChats, (chats) => {
    return chats.find((c) => c._id === chatId)?.messages;
  });

export const getUnreadMessageCounter = (chatId: string) =>
  createSelector(getAllChats, (chats) => {
    return chats.find((c) => c._id === chatId)?.unreadMessageCounter;
  });
