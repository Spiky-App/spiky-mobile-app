import { Dispatch } from 'redux';
import { Action, UserActionTypes } from '../types/userTypes';
import { SetUserPayload } from '../types/userTypes';

const setUser = (SetUserPayload: SetUserPayload) => (dispatch: Dispatch<Action>) =>
  dispatch({ type: UserActionTypes.SET_USER, payload: SetUserPayload });

export default { setUser };