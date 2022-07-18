export enum AuthActionTypes {
  SIGN_IN,
  SIGN_OUT,
  CHECKING_FINISH,
  NEW_NOTIFICATION,
  UPDATE_NOTIFICATIONS
}

interface SignInAction {
  type: AuthActionTypes.SIGN_IN;
  payload: string;
}

interface SignOutAction {
  type: AuthActionTypes.SIGN_OUT;
}

interface CheckingFinishAction {
  type: AuthActionTypes.CHECKING_FINISH;
}

interface NewNotificationAction {
  type: AuthActionTypes.NEW_NOTIFICATION;
}

interface UpdateNotificationsAction {
  type: AuthActionTypes.UPDATE_NOTIFICATIONS;
  payload: number;
}

export type Action = SignInAction | SignOutAction | CheckingFinishAction | NewNotificationAction | UpdateNotificationsAction;