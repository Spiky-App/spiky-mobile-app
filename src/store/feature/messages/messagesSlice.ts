import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { Message } from '../../../types/store';

interface MessagesState {
    messages?: Message[];
}

const initialState: MessagesState = {
    messages: undefined,
};

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages: (state: MessagesState, action: PayloadAction<Message[]>) => {
            state.messages = action.payload;
        },
    },
});

export const { setMessages } = messagesSlice.actions;

export const selectMessages = (state: RootState) => state.messages;

export default messagesSlice.reducer;
