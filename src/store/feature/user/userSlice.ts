import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';
import { User } from '../../../types/store';

interface UserState {
    nickname: string;
    notificationsNumber: number;
    newChatMessagesNumber: number;
    universityId: number;
    id: number;
}

const initialState: UserState = {
    nickname: '',
    notificationsNumber: 0,
    newChatMessagesNumber: 0,
    universityId: 0,
    id: 0,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<UserState>) => {
            state.nickname = action.payload.nickname;
            state.notificationsNumber = action.payload.notificationsNumber;
            state.newChatMessagesNumber = action.payload.newChatMessagesNumber;
            state.universityId = action.payload.universityId;
            state.id = action.payload.id;
        },
        removeUser: (state: UserState) => {
            state.nickname = initialState.nickname;
            state.notificationsNumber = initialState.notificationsNumber;
            state.universityId = initialState.universityId;
            state.id = initialState.id;
        },
        setNotificationsAndNewChatMessagesNumber: (
            state: UserState,
            action: PayloadAction<{ notificationsNumber: number; newChatMessagesNumber: number }>
        ) => {
            state.notificationsNumber = action.payload.notificationsNumber;
            state.newChatMessagesNumber = action.payload.newChatMessagesNumber;
        },
        updateNotificationsNumber: (state: UserState, action: PayloadAction<number>) => {
            state.notificationsNumber += action.payload;
        },
        clearNotificationsNumber: (state: UserState) => {
            state.notificationsNumber = 0;
        },
        increaseNotificationsNumber: (state: UserState) => {
            state.notificationsNumber = state.notificationsNumber + 1;
        },
        updateNewChatMessagesNumber: (state: UserState, action: PayloadAction<number>) => {
            state.newChatMessagesNumber = state.newChatMessagesNumber + action.payload;
        },
        increaseNewChatMessagesNumber: (state: UserState) => {
            state.newChatMessagesNumber = state.newChatMessagesNumber + 1;
        },
        updateUserNickName: (state: UserState, action: PayloadAction<string>) => {
            state.nickname = action.payload;
        },
    },
});

export const {
    setUser,
    removeUser,
    updateNotificationsNumber,
    clearNotificationsNumber,
    increaseNotificationsNumber,
    updateNewChatMessagesNumber,
    increaseNewChatMessagesNumber,
    setNotificationsAndNewChatMessagesNumber,
    updateUserNickName,
} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export const selectUserAsObject = (state: RootState) => {
    const user: User = {
        id: state.user.id,
        nickname: state.user.nickname,
        universityId: state.user.universityId,
        online: true,
    };
    return user;
};

export default userSlice.reducer;
