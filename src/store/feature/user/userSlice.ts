import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';

interface UserState {
    nickname: string;
    notificationsNumber: number;
    university: string;
    id: number;
}

const initialState: UserState = {
    nickname: '',
    notificationsNumber: 0,
    university: '',
    id: 0,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state: UserState, action: PayloadAction<UserState>) => {
            state.nickname = action.payload.nickname;
            state.notificationsNumber = action.payload.notificationsNumber;
            state.university = action.payload.university;
            state.id = action.payload.id;
        },
        removeUser: (state: UserState) => {
            state.nickname = initialState.nickname;
            state.notificationsNumber = initialState.notificationsNumber;
            state.university = initialState.university;
            state.id = initialState.id;
        },
        updateNotificationsNumber: (state: UserState, action: PayloadAction<number>) => {
            state.notificationsNumber = action.payload;
        },
    },
});

export const { setUser, removeUser, updateNotificationsNumber } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
