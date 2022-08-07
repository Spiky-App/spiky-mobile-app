import { MessagesData } from '../../services/models/spikyService';

export enum MessagesActionTypes {
    GET_EVERY_MESSAGE,
}

interface GetEveryMessage {
    type: MessagesActionTypes.GET_EVERY_MESSAGE;
    payload: MessagesData[];
}

export type Action = GetEveryMessage;
