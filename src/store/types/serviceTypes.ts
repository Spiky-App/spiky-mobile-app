import { AxiosRequestConfig } from 'axios';

export enum ActionTypes {
    SET_SPIKY_SERVICE_CONFIG,
}

interface SetSpikyServiceConfigAction {
    type: ActionTypes.SET_SPIKY_SERVICE_CONFIG;
    payload: AxiosRequestConfig;
}

export type Action = SetSpikyServiceConfigAction;
