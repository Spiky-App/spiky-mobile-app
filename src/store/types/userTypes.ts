export enum UserActionTypes {
    SET_USER
}

export interface SetUserPayload {
    nickname: string;
    n_notifications: number;
}

interface SetUserAction {
    type: UserActionTypes.SET_USER;
    payload: SetUserPayload;
}

export type Action = SetUserAction;