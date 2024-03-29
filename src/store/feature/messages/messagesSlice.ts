import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ActiveMessage, Message } from '../../../types/store';

interface MessagesState {
    messages: Message[];
    loading: boolean;
    filter: string;
    moreMsg: boolean;
    activeMsg?: ActiveMessage;
    lastMessageId?: number;
    draft: boolean;
    univers?: string | undefined;
}

const initialState: MessagesState = {
    messages: [],
    loading: false,
    filter: '',
    moreMsg: false,
    activeMsg: undefined,
    lastMessageId: undefined,
    draft: false,
    univers: undefined,
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state: MessagesState, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
        setFilter: (state: MessagesState, action: PayloadAction<string>) => {
            state.filter = action.payload;
        },
        setLoading: (state: MessagesState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setMoreMsg: (state: MessagesState, action: PayloadAction<boolean>) => {
            state.moreMsg = action.payload;
        },
        setLastMessageId: (state: MessagesState, action: PayloadAction<number | undefined>) => {
            state.lastMessageId = action.payload;
        },
        setDraft: (state: MessagesState, action: PayloadAction<boolean>) => {
            state.draft = action.payload;
        },
        setUniversitiesFilter: (
            state: MessagesState,
            action: PayloadAction<string | undefined>
        ) => {
            state.univers = action.payload;
        },
        addMessage: (state: MessagesState, action: PayloadAction<Message>) => {
            state.messages = [action.payload, ...state.messages];
        },
        updateMessage: (state: MessagesState, action: PayloadAction<Message>) => {
            state.messages = state.messages.map(m => {
                if (m.id == action.payload.id) {
                    m.message = action.payload.message;
                }
                return m;
            });
        },
    },
});

export const {
    setMessages,
    setFilter,
    setLoading,
    setMoreMsg,
    setLastMessageId,
    setDraft,
    addMessage,
    updateMessage,
    setUniversitiesFilter,
} = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages;

export default messagesSlice.reducer;
