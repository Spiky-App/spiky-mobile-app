import { Action, ActionTypes } from '../types/authTypes';

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

export const authReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case ActionTypes.SIGN_IN:
      return { ...state, token: action.payload };
    case ActionTypes.SIGN_OUT:
      return { ...state, token: undefined };
    case ActionTypes.CHECKING_FINISH:
      return {
        ...state,
        checking: false,
      };
    case ActionTypes.NEW_NOTIFICATION:
      return {
        ...state,
        n_notificaciones: state.n_notificaciones + 1,
      };
    case ActionTypes.UPDATE_NOTIFICATIONS:
      return {
        ...state,
        n_notificaciones: action.payload,
      };
    default:
      return state;
  }
};
