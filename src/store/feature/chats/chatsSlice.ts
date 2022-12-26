import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ChatMessage, Conversation } from '../../../types/store';

interface ChatsState {
    conversations: Conversation[];
    activeConversationId: number;
    updateAuxActiveConversation: boolean;
}

const initialState: ChatsState = {
    conversations: [],
    activeConversationId: 0,
    updateAuxActiveConversation: false,
};

export const chatsSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setConversations: (state: ChatsState, action: PayloadAction<Conversation[]>) => {
            state.conversations = action.payload;
        },
        setActiveConversationId: (state: ChatsState, action: PayloadAction<number>) => {
            state.activeConversationId = action.payload;
        },
        openNewMsgConversation: (state: ChatsState, action: PayloadAction<number>) => {
            state.conversations = state.conversations.map(conver => {
                if (conver.id == action.payload) {
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
        updateLastChatMsgConversation: (
            state: ChatsState,
            action: PayloadAction<{ chatMsg: ChatMessage; newMsg: boolean }>
        ) => {
            const { chatMsg, newMsg } = action.payload;
            state.conversations = state.conversations
                .map(conver => {
                    if (conver.id === chatMsg.conversationId) {
                        return { ...conver, chatmessage: { ...chatMsg, newMsg } };
                    } else {
                        return conver;
                    }
                })
                .sort((a, b) => b.chatmessage.date - a.chatmessage.date);
        },
        resetActiveConversationId: (state: ChatsState) => {
            state.activeConversationId = initialState.activeConversationId;
        },
        updateAuxActiveConversation: (state: ChatsState) => {
            state.updateAuxActiveConversation = !state.updateAuxActiveConversation;
        },
    },
});

export const {
    setConversations,
    addConversation,
    openNewMsgConversation,
    setUserStateConversation,
    updateLastChatMsgConversation,
    resetActiveConversationId,
    setActiveConversationId,
    updateAuxActiveConversation,
} = chatsSlice.actions;

export const selectChats = (state: RootState) => state.chats;

export default chatsSlice.reducer;
