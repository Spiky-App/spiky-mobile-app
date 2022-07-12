import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { chatReducer } from './chatReducer';
import { messageReducer } from './messageReducer';
import { uiReducer } from './uiReducer';

export type Action = {
    type: string,
    payload?: any
}
export const appReducer = combineReducers({
    auth: authReducer,
    ui: uiReducer,
    message: messageReducer,
    chat: chatReducer,
  });

export default appReducer;