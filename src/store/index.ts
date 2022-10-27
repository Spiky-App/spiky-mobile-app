import { configureStore } from '@reduxjs/toolkit';
import authSlice from './feature/auth/authSlice';
import messagesSlice from './feature/messages/messagesSlice';
import serviceConfigSlice from './feature/serviceConfig/serviceConfigSlice';
import toastSlice from './feature/toast/toastSlice';
import uiSlice from './feature/ui/uiSlice';
import userSlice from './feature/user/userSlice';
import chatsSlice from './feature/chats/chatsSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        serviceConfig: serviceConfigSlice,
        user: userSlice,
        ui: uiSlice,
        messages: messagesSlice,
        toast: toastSlice,
        chats: chatsSlice,
    },
});

// RootState will have the state application tree: the father keys are defined above
export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
