import { Dispatch } from 'redux';
import { Action, AuthActionTypes } from '../types/authTypes';

const signIn = (token: string) => (dispatch: Dispatch<Action>) =>
  dispatch({ type: AuthActionTypes.SIGN_IN, payload: token });

const signOut = () => (dispatch: Dispatch<Action>) => dispatch({ type: AuthActionTypes.SIGN_OUT });

export default { signIn, signOut };
