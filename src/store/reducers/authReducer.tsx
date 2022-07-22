import { Action, AuthActionTypes } from '../types/authTypes';

interface State {
  isLoading: boolean;
  isSignout: boolean;
  checking: boolean;
  n_notificaciones: number;
  token?: string;
}

const initialState: State = {
  isLoading: false,
  isSignout: false,
  checking: true,
  n_notificaciones: 0,
};

export const authReducer = (state = initialState, action: Action): State => {
  switch (action.type) {
    case AuthActionTypes.SIGN_IN:
      return { ...state, token: action.payload };
    case AuthActionTypes.SIGN_OUT:
      return {
        isLoading: state.isLoading,
        isSignout: state.isSignout,
        checking: state.checking,
        n_notificaciones: state.n_notificaciones,
      };
    case AuthActionTypes.CHECKING_FINISH:
      return {
        ...state,
        checking: false,
      };
    case AuthActionTypes.NEW_NOTIFICATION:
      return {
        ...state,
        n_notificaciones: state.n_notificaciones + 1,
      };
    case AuthActionTypes.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        n_notificaciones: action.payload,
      };
    default:
      return state;
  }
};
