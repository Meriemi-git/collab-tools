import { createEntityAdapter, EntityAdapter } from '@ngrx/entity';
import { Action, createReducer, on } from '@ngrx/store';
import {
  Chat,
  ChatMessage,
  WebsocketMember,
  WebsocketStatus,
} from '@collab-tools/datamodel';
import * as actions from '../actions/chat.action';
import { ChatState } from '../states/chat.state';

export const adapter: EntityAdapter<Chat> = createEntityAdapter<Chat>({
  sortComparer: sortByDate,
  selectId: (conversation: Chat) => conversation._id,
});

export function sortByDate(a: Chat, b: Chat): number {
  return a.createdAt.getTime() - b.createdAt.getTime();
}

export const initialstate: ChatState = adapter.getInitialState({
  error: null,
  currentChatId: null,
  canJoinChats: false,
});

const chatReducer = createReducer(
  initialstate,
  on(actions.CloseCurrentChat, (state) => ({
    ...state,
    currentChatId: null,
  })),
  on(actions.SelectChat, (state, { chatId }) =>
    adapter.updateOne(
      {
        id: chatId,
        changes: { unreadMessageCounter: null },
      },
      {
        ...state,
        currentChatId: chatId,
        error: null,
      }
    )
  ),
  on(actions.JoinChatSuccess, (state, { chat }) => {
    return adapter.updateOne(
      {
        id: chat._id,
        changes: { ...chat, joined: true },
      },
      {
        ...state,
        error: null,
      }
    );
  }),
  on(
    actions.UpdateChatMemberStatus,
    (state, { chatId, chatMemberId, status }) => {
      return adapter.updateOne(
        {
          id: chatId,
          changes: {
            members: updateMemberStatus(
              state.entities[chatId].members,
              status,
              chatMemberId
            ),
          },
        },
        {
          ...state,
        }
      );
    }
  ),
  on(actions.GetAllChatsSuccess, (state, { chats }) => {
    return adapter.addMany(chats, { ...state, error: null });
  }),
  on(actions.CreateChatSuccess, (state, { chat }) => {
    return adapter.addOne(chat, { ...state, error: null });
  }),
  on(actions.ChatError, (state, { error }) => ({
    ...state,
    error,
  })),

  on(actions.LeaveChatSuccess, (state, { chatId }) => {
    return adapter.removeOne(chatId, {
      ...state,
      error: null,
    });
  }),
  on(actions.GetLastChatMessagesSuccess, (state, { chatMessages, chatId }) => {
    return adapter.updateOne(
      {
        id: chatId,
        changes: {
          messages: addMessages(state.entities[chatId].messages, chatMessages),
        },
      },
      {
        ...state,
      }
    );
  }),
  on(actions.SendChatMessageSuccess, (state, { chatMessage }) => {
    return adapter.updateOne(
      {
        id: chatMessage.chatId,
        changes: {
          messages: addMessage(
            state.entities[chatMessage.chatId].messages,
            chatMessage
          ),
          unreadMessageCounter: updateUnreadMessageCounter(
            state.currentChatId,
            chatMessage.chatId,
            state.entities[chatMessage.chatId]?.unreadMessageCounter
          ),
        },
      },
      {
        ...state,
      }
    );
  }),
  on(actions.InviteUsersToChatSuccess, (state, { chat }) => {
    return adapter.updateOne(
      {
        id: chat._id,
        changes: {
          members: chat.members,
        },
      },
      {
        ...state,
      }
    );
  })
);

export function reducer(state: ChatState | undefined, action: Action) {
  return chatReducer(state, action);
}

export const { selectAll, selectEntities, selectIds, selectTotal } =
  adapter.getSelectors();

function addMessages(
  messages: ChatMessage[],
  chatMessages: ChatMessage[]
): ChatMessage[] {
  if (messages == null) {
    messages = [];
  }
  if (chatMessages == null || chatMessages.length == 0) {
    return messages;
  }
  const msgToAdd: ChatMessage[] = [];
  chatMessages.forEach((newMsg) => {
    if (!messages.some((existing) => existing.sendAt == newMsg.sendAt)) {
      msgToAdd.push(newMsg);
    }
  });
  return [...messages, ...msgToAdd];
}

function addMessage(
  messages: ChatMessage[],
  chatMessage: ChatMessage
): ChatMessage[] {
  if (messages == null) {
    messages = [];
  }

  if (!messages.some((m) => m.sendAt == chatMessage.sendAt)) {
    return [chatMessage, ...messages];
  }
}

function updateMemberStatus(
  members: WebsocketMember[],
  status: WebsocketStatus,
  memberId: string
): WebsocketMember[] {
  return members?.map((member) => {
    if (member.userId === memberId) {
      const updatedMember = Object.assign({}, member);
      updatedMember.status = status;
      return updatedMember;
    } else {
      return member;
    }
  });
}
function updateUnreadMessageCounter(
  currentChatId: string,
  messageChatId: string,
  actualCounter: number
): number {
  if (currentChatId == null || messageChatId !== currentChatId) {
    return actualCounter == null ? 1 : actualCounter + 1;
  } else {
    return 0;
  }
}
