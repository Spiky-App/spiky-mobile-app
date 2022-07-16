import { Dispatch } from 'redux';
import { LoginResponseData } from '../../services/types/spikyService';
import { types } from '../types';
import { Action, ActionTypes } from '../types/authTypes';

const signIn = (responseData: LoginResponseData) => {
  return (dispatch: Dispatch<Action>) => {
    // if (body.ok) {
    //   // Get every university from the server
    //   // Set Universities action
    //   // dispatch(uiSetUniversities(body_uni.universidades));

    //   // No me acuerdo de que hace esto
    //   // dispatch(uiOpenAlert({ ok: body.ok }));

    //   // Set the login action with the user data with the loginResponseData
    //   dispatch(
    //     login({
    //       uid: body.ok,
    //       alias: body.uid,
    //       universidad: alias,
    //       n_notificaciones: n_notificaciones,
    //     })
    //   );
    // } else {
    //   dispatch(uiOpenAlert(ok));
    // }
    dispatch({ type: ActionTypes.SIGN_IN, payload: responseData.token });
  };
};

const signOut = () => (dispatch: Dispatch<Action>) => dispatch({ type: ActionTypes.SIGN_OUT });

// /* Log Out Action */

// const logout = () => ({ type: types.authLogout });

// /* Auth Check Action */
// const checkingFinish = () => ({ type: types.authCheckingFinish });

// const authUpdateNotifications = (payload: IAuthNewNotificationAction) => ({
//   type: types.authUpdateNotifications,
//   payload,
// });

export default { signIn, signOut };
