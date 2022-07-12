import { types } from '../types';
import { Action } from './index';

const initialState = {
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
    reacciones: [{}],
    trackings: [{}],
    respuestas: [],
    usuario: { alias: '', universidad: { alias: '' } },
    num_respuestas: 0,
    banned: 0,
  },
};

export const messageReducer = (state = initialState, action : Action) => {
  switch (action.type) {
    case types.msgAddNew:
      return {
        ...state,
        mensajes: [action.payload, ...state.mensajes],
      };
    case types.msgNewLoaded:
      return {
        ...state,
        lastMsg: action.payload.lastMsg,
        mensajes: [...action.payload.mensajes],
      };
    case types.msgLoaded:
      return {
        ...state,
        lastMsg: action.payload.lastMsg,
        mensajes: [...state.mensajes, ...action.payload.mensajes],
      };
    case types.msgUpdate:
      return {
        ...state,
        mensajes: action.payload,
      };
    case types.msgUpdateActiveMsg:
      return {
        ...state,
        activeMsg: action.payload,
      };
    case types.msgFilter:
      return {
        ...state,
        filter: action.payload,
      };
    case types.msgActiveMsg:
      return {
        ...state,
        activeMsg: action.payload,
      };
    case types.msgDisableMsg:
      return {
        ...state,
        activeMsg: {
          id_mensaje: '',
          mensaje: '',
          fecha: '',
          favor: 0,
          contra: 0,
          neutro: 0,
          id_usuario: '',
          reacciones: [{}],
          trackings: [{}],
          respuestas: [],
          usuario: { alias: '', universidad: { alias: '' } },
          num_respuestas: 0,
        },
      };
    case types.msgMoreMsg:
      return {
        ...state,
        moreMsg: action.payload,
      };
    case types.msgSetLoading:
      return {
        ...state,
        loading: action.payload,
      };
    case types.msgLogout:
      return {
        ...initialState,
      };

    default:
      return state;
  }
};
