import { Dispatch } from 'redux';
import { LoginResponseData } from '../../services/models/spikyService';
import { Action, AuthActionTypes } from '../types/authTypes';

const signIn = (responseData: LoginResponseData) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: AuthActionTypes.SIGN_IN, payload: responseData.token });
  };
};

const signOut = () => (dispatch: Dispatch<Action>) => dispatch({ type: AuthActionTypes.SIGN_OUT });

// /* Log Out Action */

// const logout = () => ({ type: types.authLogout });

// /* Auth Check Action */
// const checkingFinish = () => ({ type: types.authCheckingFinish });

// const authUpdateNotifications = (payload: IAuthNewNotificationAction) => ({
//   type: types.authUpdateNotifications,
//   payload,
// });

export default { signIn, signOut };
