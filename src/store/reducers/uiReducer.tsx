import { types } from '../types';
import { Action, UIActionTypes } from '../types/uiTypes';

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
    case UIActionTypes.SET_UNIVERSITIES:
      return {
        ...state,
        universities: action.payload,
      };
    default:
      return state;
  }
};
