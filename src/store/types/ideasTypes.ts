import { MessagesResponseData } from "../../services/models/spikyService";

export enum MessagesActionTypes {
    GET_EVERY_MESSAGE,
  }
  
  interface GetEveryIdea {
    type: MessagesActionTypes.GET_EVERY_MESSAGE;
    payload: MessagesResponseData;
  }


export type Action = GetEveryIdea;