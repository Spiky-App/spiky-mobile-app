import { types } from "../types";
import { Action } from './index';

const initialState = {
  modelOpenM: false,
  modelOpenR: false,
  modelOpenReport: false,
  modelOpenReply: false,
  modelOpenNotify: false,
  modelOpenNotifications: false,
  alertMsg: null,
  loadingMsg: false,
  universities: [],
  modelOpenPopUp: {
    open: false,
    alias: '',
    universidad: '',
    type: 0,
    id_mensaje: null,
  },
  modelOpenAlert: {
    open: false,
    style: {},
    icon: '',
    title: '',
  },
};

export const uiReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case types.uiOpenModalM:
      return {
        ...state,
        modelOpenM: true,
      };
    case types.uiCloseModalM:
      return {
        ...state,
        modelOpenM: false,
      };
    case types.uiOpenModalR:
      return {
        ...state,
        modelOpenR: true,
      };
    case types.uiCloseModalR:
      return {
        ...state,
        modelOpenR: false,
      };
    case types.uiOpenModalReport:
      return {
        ...state,
        modelOpenReport: true,
      };
    case types.uiCloseModalReport:
      return {
        ...state,
        modelOpenReport: false,
      };
    case types.uiOpenModalReply:
      return {
        ...state,
        modelOpenReply: true,
      };
    case types.uiCloseModalReply:
      return {
        ...state,
        modelOpenReply: false,
      };
    case types.uiOpenModalNotify:
      return {
        ...state,
        modelOpenNotify: true,
      };
    case types.uiCloseModalNotify:
      return {
        ...state,
        modelOpenNotify: false,
      };
    case types.uiOpenModalNotifications:
      return {
        ...state,
        modelOpenNotifications: true,
      };
    case types.uiCloseModalNotifications:
      return {
        ...state,
        modelOpenNotifications: false,
      };
    case types.uiOpenModalPopUp:
      return {
        ...state,
        modelOpenPopUp: {
          ...action.payload,
          open: true,
        },
      };
    case types.uiCloseModalPopUp:
      return {
        ...state,
        modelOpenPopUp: initialState.modelOpenPopUp,
      };
    case types.uiOpenAlert:
      return {
        ...state,
        alertMsg: action.payload,
      };
    case types.uiCloseAlert:
      return {
        ...state,
        alertMsg: null,
      };
    case types.uiSetLoading:
      return {
        ...state,
        loadingMsg: action.payload,
      };
    case types.uiSetUniversities:
      return {
        ...state,
        universities: action.payload,
      };
    case types.uiOpenModalAlert:
      return {
        ...state,
        modelOpenAlert: {
          ...state.modelOpenAlert,
          ...action.payload,
          open: true,
        },
      };
    case types.uiCloseModalAlert:
      return {
        ...state,
        modelOpenAlert: {
          open: false,
          style: {},
          icon: '',
          title: '',
        },
      };
    default:
      return state;
  }
};
