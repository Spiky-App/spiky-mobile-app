import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';

interface UserState {
    nickname: string;
    notificationsNumber: number;
    universityId: number;
    id: number;
}

const initialState: UserState = {
    nickname: '',
    notificationsNumber: 0,
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
            state.universityId = action.payload.universityId;
            state.id = action.payload.id;
        },
        removeUser: (state: UserState) => {
            state.nickname = initialState.nickname;
            state.notificationsNumber = initialState.notificationsNumber;
            state.universityId = initialState.universityId;
            state.id = initialState.id;
        },
        updateNotificationsNumber: (state: UserState, action: PayloadAction<number>) => {
            state.notificationsNumber += action.payload;
        },
        clearNotificationsNumber: (state: UserState) => {
            state.notificationsNumber = 0;
        },
    },
});

export const { setUser, removeUser, updateNotificationsNumber, clearNotificationsNumber } =
    userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
