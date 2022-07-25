import { AxiosRequestConfig } from 'axios';
import { Dispatch } from 'redux';
import { Action, ActionTypes } from '../types/serviceTypes';

const setSpikyServiceConfig = (spikyServiceConfig: AxiosRequestConfig) => {
  return (dispatch: Dispatch<Action>) => {
    dispatch({ type: ActionTypes.SET_SPIKY_SERVICE_CONFIG, payload: spikyServiceConfig });
  };
};

export default { setSpikyServiceConfig };
