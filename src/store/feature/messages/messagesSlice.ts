import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { ActiveMessage, Message } from '../../../types/store';

interface MessagesState {
    messages: Message[];
    loading: boolean;
    filter: string;
    moreMsg: boolean;
    activeMsg?: ActiveMessage;
}

const initialState: MessagesState = {
    messages: [],
    loading: false,
    filter: '',
    moreMsg: false,
    activeMsg: undefined,
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
    },
});

export const { setMessages, setFilter, setLoading } = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages;

export default messagesSlice.reducer;
