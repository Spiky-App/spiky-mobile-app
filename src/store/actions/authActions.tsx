import { login } from '.';
import { AuthLoginService } from '../../services/Auth';
import { types } from "../types";
import { uiOpenAlert } from './ui';

/* Log In Action */
interface IAuthAction {
  correo: string;
  contrasena: string;
}

const loginAction = (payload: IAuthAction) => ({
  type: types.authLogin,
  payload
});

export const startLogin = (authData : IAuthAction ) => {
  const {ok} = AuthLoginService(authData);

  return async dispatch => {
    if (body.ok) {
      // Get every university from the server
      // Set Universities action
      // dispatch(uiSetUniversities(body_uni.universidades));

      // No me acuerdo de que hace esto
      // dispatch(uiOpenAlert({ ok: body.ok }));

      
      // Set the login action with the user data with the loginResponseData
      dispatch(
        login({
          uid: body.ok,
          alias: body.uid,
          universidad: alias,
          n_notificaciones: n_notificaciones,
        })
      );
    } else {
      dispatch(uiOpenAlert(ok));
    }
  };
}

/* Log Out Action */

const logout = () => ({ type: types.authLogout });

/* Auth Check Action */
const checkingFinish = () => ({ type: types.authCheckingFinish });


/* Auth New Notification Action */
interface IAuthNewNotificationAction {
    notification: number;
}
const authUpdateNotifications = (payload : IAuthNewNotificationAction) => ({
  type: types.authUpdateNotifications,
  payload
});

export default {
  loginAction,
  logout,
  checkingFinish,
  authUpdateNotifications
};
