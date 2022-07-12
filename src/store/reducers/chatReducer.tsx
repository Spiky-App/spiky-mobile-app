import { Action } from ".";
import { types } from "../types";



const initialState = {
  chatActivo: null,
  mensajes: [],
  convers: []
};

export const chatReducer = (state = initialState, action : Action) => {
  switch (action.type) {
    case types.chatGetChats:
      return {
        ...state,
        convers: action.payload
      };
    case types.chatGetMessages:
      return {
        ...state,
        mensajes: action.payload.mensajes
      };
    case types.chatSetActiveChat:
      return {
        ...state,
        chatActivo: action.payload.conver,
        recepient: action.payload.recepient,
        id_universidad: action.payload.id_universidad
      };
    case types.chatNuevoMensaje:
      const msg = {
        chatmensaje: action.payload.nuevoMensaje.chatmensaje,
        fecha: action.payload.nuevoMensaje.fecha?action.payload.nuevoMensaje.fecha:Date.now(),
        id_chatmensaje: action.payload.nuevoMensaje.id_chatmensaje,
        mensaje: action.payload.nuevoMensaje.mensaje != null ?{
          id_mensaje: action.payload.nuevoMensaje.mensaje?.id_mensaje,
          mensaje: action.payload.nuevoMensaje.mensaje?.mensaje
        }:null,
        id_usuario: action.payload.nuevoMensaje.id_usuario
      };

      state.convers.map((item : any) => {
        if(item.id_conversacion === action.payload.nuevoMensaje.id_conversacion){
          item.chatmensajes = [{
            chatmensaje: action.payload.nuevoMensaje.chatmensaje,
            fecha: action.payload.nuevoMensaje.fecha?action.payload.nuevoMensaje.fecha:Date.now(),
            ...item.chatmensajes
          }];
        }
      });

      if (state.chatActivo === action.payload.nuevoMensaje.id_conversacion ) {
          return {
            ...state,
            mensajes: [
              ...state.mensajes,
              msg
            ]
          };
      } else {
        return {
          ...state,
        };
      }
    case types.chatNuevoChat:{
      return {
        ...state,
        convers: [
          ...state.convers,
          action.payload
        ]
      };
    }

    default:
      return state;
  }
};
