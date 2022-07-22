import { Universidad } from '../../services/models/spikyService';
import { Action, UIActionTypes } from '../types/uiTypes';

interface State {
  modelOpenM: boolean;
  modelOpenR: boolean;
  modelOpenReport: boolean;
  modelOpenReply: boolean;
  modelOpenNotify: boolean;
  modelOpenNotifications: boolean;
  alertMsg?: string;
  loadingMsg: boolean;
  universities: Universidad[];
  modelOpenPopUp: {
    open: boolean;
    alias: '';
    universidad: '';
    type: 0;
    id_mensaje: null;
  };
  modelOpenAlert: {
    open: boolean;
    style: {};
    icon: '';
    title: '';
  };
}

const initialState: State = {
  modelOpenM: false,
  modelOpenR: false,
  modelOpenReport: false,
  modelOpenReply: false,
  modelOpenNotify: false,
  modelOpenNotifications: false,
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

export const uiReducer = (state: State = initialState, action: Action): State => {
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
