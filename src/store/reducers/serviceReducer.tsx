import config from '../../config';
import SpikyService from '../../services/SpikyService';
import { Action, ActionTypes } from '../types/serviceTypes';

interface State {
  spikyService: SpikyService;
}

const initialState: State = {
  spikyService: new SpikyService(config),
};

export const serviceReducer = (state: State = initialState, action: Action): State => {
  switch (action.type) {
    case ActionTypes.SET_SPIKY_SERVICE_CONFIG:
      return {
        ...state,
        spikyService: new SpikyService({ ...config, ...action.payload }),
      };
    default:
      return state;
  }
};
