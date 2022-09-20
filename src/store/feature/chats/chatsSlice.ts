import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ChatMessage, Conversation } from '../../../types/store';

interface ChatsState {
    conversations: Conversation[];
}

const initialState: ChatsState = {
    conversations: [],
};

export const chatsSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setConversations: (state: ChatsState, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        openNewMsgConversation: (state: ChatsState, action: PayloadAction<number>) => {
            state.conversations = state.conversations.map(conver => {
                if (conver.id === action.payload) {
                    let converUpdated = {
                        ...conver,
                        chatmessage: { ...conver.chatmessage, newMsg: false },
                    };
                    return converUpdated;
                } else {
                    return conver;
                }
            });
        },
        setUserStateConversation: (
            state: ChatsState,
            action: PayloadAction<{ online: boolean; converId: number; uid: number }>
        ) => {
            state.conversations = state.conversations.map(conver => {
                if (conver.id === action.payload.converId) {
                    const userNumber: 'user_1' | 'user_2' =
                        conver.user_1.id !== action.payload.uid ? 'user_1' : 'user_2';
                    let converUpdated = {
                        ...conver,
                        [userNumber]: { ...conver[userNumber], online: action.payload.online },
                    };
                    return converUpdated;
                } else {
                    return conver;
                }
            });
        },
        addConversation: (state: ChatsState, action: PayloadAction<Conversation>) => {
            state.conversations = [action.payload, ...state.conversations];
        },
        updateConversations: (state: ChatsState, action: PayloadAction<Conversation>) => {
            let conver_no_sorted = state.conversations.map(conver => {
                if (conver.id === action.payload.id) {
                    return action.payload;
                } else {
                    return conver;
                }
            });
            state.conversations = conver_no_sorted.sort(
                (a, b) => b.chatmessage.date - a.chatmessage.date
            );
        },
        updateLastChatMsgConversation: (state: ChatsState, action: PayloadAction<ChatMessage>) => {
            let conver_no_sorted = state.conversations.map(conver => {
                if (conver.id === action.payload.conversationId) {
                    return { ...conver, chatmessage: { ...action.payload, newMsg: false } };
                } else {
                    return conver;
                }
            });
            state.conversations = conver_no_sorted.sort(
                (a, b) => b.chatmessage.date - a.chatmessage.date
            );
        },
    },
});

export const {
    setConversations,
    addConversation,
    updateConversations,
    openNewMsgConversation,
    setUserStateConversation,
    updateLastChatMsgConversation,
} = chatsSlice.actions;

export const selectChats = (state: RootState) => state.chats;

export default chatsSlice.reducer;
