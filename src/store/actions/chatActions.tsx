import { types } from "../types";

interface IGetChatAction {
  conversation: any[];
}

export const chatGetChats = (payload: IGetChatAction) => ({
  type: types.chatGetChats,
  payload
});

interface IGetMessagesAction {
  mensajes: any[];
}

export const chatGetMessages = (payload: IGetMessagesAction) => ({
  type: types.chatGetMessages,
  payload
});

interface ISetActiveChatAction {
  conver: number | null;
  recepient: string | null;
  id_universidad: number | null;
}

export const chatSetActiveChat = (payload: ISetActiveChatAction) => ({
  type: types.chatSetActiveChat,
  payload
});

const clearActiveChatAction: ISetActiveChatAction = {
  conver: null,
  recepient: null,
  id_universidad: null
};

export const clearActiveChat = () => ({
  type: types.chatSetActiveChat,
  payload: clearActiveChatAction
});

interface IChatNuevoMensajeAction {
  nuevoMensaje: any;
}

export const chatNuevoMensaje = (payload: IChatNuevoMensajeAction) => ({
  type: types.chatNuevoMensaje,
  payload
});

interface INuevoChatAction {
  conversacion: any;
}
export const chatNuevoChat = (payload: INuevoChatAction) => ({
  type: types.chatNuevoChat,
  payload
});
