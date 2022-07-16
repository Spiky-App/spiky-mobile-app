import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { chatReducer } from './chatReducer';
import { messageReducer } from './messageReducer';
import { uiReducer } from './uiReducer';

const appReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  message: messageReducer,
  chat: chatReducer,
});

export default appReducer;

export type State = ReturnType<typeof appReducer>;
