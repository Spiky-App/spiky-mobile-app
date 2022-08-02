import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../..';

interface AuthState {
    token: string | undefined;
}

const initialState: AuthState = {
    token: undefined,
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        signIn: (state, action: PayloadAction<string>) => {
            state.token = action.payload;
        },
        signOut: state => {
            state.token = undefined;
        },
    },
});

export const { signIn, signOut } = authSlice.actions;

export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;
