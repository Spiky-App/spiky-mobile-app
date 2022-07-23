import { Action, UserActionTypes } from '../types/userTypes';

interface State {
  nickName: string;
  n_notifications: number;
  university: string;
}

const initialState: State = {
  nickName: '',
  n_notifications: 0,
  university: '',
};

export const userReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case UserActionTypes.SET_USER:
      return {
        nickName: action.payload.nickname,
        n_notifications: action.payload.n_notifications,
        university: action.payload.university,
      };
    default:
      return state;
  }
};
