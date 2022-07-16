export enum ActionTypes {
  SIGN_IN,
  SIGN_OUT,
  CHECKING_FINISH,
  NEW_NOTIFICATION,
  UPDATE_NOTIFICATIONS
}

interface SignInAction {
  type: ActionTypes.SIGN_IN;
  payload: string;
}

interface SignOutAction {
  type: ActionTypes.SIGN_OUT;
}

interface CheckingFinishAction {
  type: ActionTypes.CHECKING_FINISH;
}

interface NewNotificationAction {
  type: ActionTypes.NEW_NOTIFICATION;
}

interface UpdateNotificationsAction {
  type: ActionTypes.UPDATE_NOTIFICATIONS;
  payload: number;
}

export type Action = SignInAction | SignOutAction | CheckingFinishAction | NewNotificationAction | UpdateNotificationsAction;