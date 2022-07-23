import { Action, UserActionTypes } from '../types/userTypes';

interface State {
  nickName: string;
  n_notifications: number;
}

const initialState: State = {
  nickName: '',
  n_notifications: 0,
};

export const userReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case UserActionTypes.SET_USER:
      return { nickName: action.payload.nickname, n_notifications: action.payload.n_notifications };
    default:
      return state;
  }
};
