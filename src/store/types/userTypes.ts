export enum UserActionTypes {
    SET_USER,
}

export interface SetUserPayload {
    nickname: string;
    n_notifications: number;
    university: string;
}

interface SetUserAction {
    type: UserActionTypes.SET_USER;
    payload: SetUserPayload;
}

export type Action = SetUserAction;
