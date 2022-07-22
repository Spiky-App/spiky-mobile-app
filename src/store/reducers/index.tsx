import { combineReducers } from 'redux';
import { authReducer } from './authReducer';
import { chatReducer } from './chatReducer';
import { messageReducer } from './messageReducer';
import { serviceReducer } from './serviceReducer';
import { uiReducer } from './uiReducer';

const appReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  message: messageReducer,
  chat: chatReducer,
  service: serviceReducer,
});

export default appReducer;

export type State = ReturnType<typeof appReducer>;
