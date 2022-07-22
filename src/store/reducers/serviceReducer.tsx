import { AxiosRequestConfig } from 'axios';
import config from '../../config';
import SpikyService from '../../services/SpikyService';
import { Action, ActionTypes } from '../types/serviceTypes';

interface State {
  spikyServiceConfig: AxiosRequestConfig;
}

const initialState: State = {
  spikyServiceConfig: config,
};

export const serviceReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_SPIKY_SERVICE_CONFIG:
      return {
        ...state,
        spikyServiceConfig: { ...state.spikyServiceConfig, ...action.payload },
      };
    default:
      return state;
  }
};
