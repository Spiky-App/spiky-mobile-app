export enum HelperMessageType {
  WARNING,
}

export interface HelperMessage {
  message: string;
  type: HelperMessageType;
}
