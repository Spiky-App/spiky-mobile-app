import { types } from "../types";

/* 
authCheckingFinish: '[auth] Finish checking login state',
authStartLogin: '[auth] Start login',
authLogin: '[auth] Login',
authStartRegister: '[auth] Register',
authStartTokenRenew: '[auth] Start token renew',
authLogout: '[auth] Logout',
authNewNotification: '[auth] Add new notification',
authUpdateNotifications: '[auth] Update notifications', 
*/

/* Log In Action */
interface IAuthAction {
  Email: string;
  Password: string;
}

const login = (payload: IAuthAction) => ({
  type: types.authLogin,
  payload
});

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
  login,
  logout,
  checkingFinish,
  authUpdateNotifications
};
