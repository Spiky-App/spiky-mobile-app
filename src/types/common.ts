export enum HelperMessageType {
    WARNING,
}

export interface HelperMessage {
    message: string;
    type: HelperMessageType;
}

export enum StatusType {
    WARNING,
    DEFAULT,
    NOTIFICATION,
    NUDGE,
    INFORMATION,
}
