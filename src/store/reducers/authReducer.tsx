import { types } from '../types';
import { Action } from './index';

const initialState = {
  checking: true,
  n_notificaciones: 0,
};

export const authReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case types.authLogin:
      return {
        ...state,
        ...action.payload,
        checking: false,
      };

    case types.authCheckingFinish:
      return {
        ...state,
        checking: false,
      };
    case types.authLogout:
      return {
        checking: false,
      };
    case types.authNewNotification:
      return {
        ...state,
        n_notificaciones: state.n_notificaciones + 1,
      };
    case types.authUpdateNotifications:
      return {
        ...state,
        n_notificaciones: action.payload,
      };
    default:
      return state;
  }
};
