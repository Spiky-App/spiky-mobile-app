import { MessagesData } from '../../services/models/spikyService';
import { Action, MessagesActionTypes } from '../types/ideasTypes';

interface State {
  mensajes: MessagesData[];
  loading: boolean;
  filter: string;
  moreMsg: boolean;
  activeMsg: {
    id_mensaje: string;
    mensaje: string;
    fecha: string;
    favor: number;
    contra: number;
    neutro: number;
    id_usuario: string;
    reacciones: [];
    trackings: [];
    respuestas: [];
    usuario: {
      alias: string;
      universidad: {
        alias: string;
      };
    };
    num_respuestas: number;
    banned: number;
  };
}

const initialState: State = {
  mensajes: [],
  loading: false,
  filter: '',
  moreMsg: false,
  activeMsg: {
    id_mensaje: '',
    mensaje: '',
    fecha: '',
    favor: 0,
    contra: 0,
    neutro: 0,
    id_usuario: '',
    reacciones: [],
    trackings: [],
    respuestas: [],
    usuario: {
      alias: '',
      universidad: {
        alias: '',
      },
    },
    num_respuestas: 0,
    banned: 0,
  },
};

export const messageReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case MessagesActionTypes.GET_EVERY_MESSAGE:
      return {
        ...state,
        mensajes: action.payload,
      };
    default:
      return state;
  }
};
