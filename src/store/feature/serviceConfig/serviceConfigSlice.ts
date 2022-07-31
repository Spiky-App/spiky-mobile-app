import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AxiosRequestConfig } from 'axios';
import { RootState } from '../..';
import config from '../../../constants/config';

interface ServiceConfigState {
  config: AxiosRequestConfig;
}

const initialState: ServiceConfigState = {
  config,
};

export const serviceConfigSlice = createSlice({
  name: 'serviceConfig',
  initialState,
  reducers: {
    updateServiceConfig: (state: ServiceConfigState, action: PayloadAction<AxiosRequestConfig>) => {
      state.config = { ...state.config, ...action.payload };
    },
    restartConfig: (state: ServiceConfigState) => {
      state.config = initialState.config;
    }
  },
});

export const { updateServiceConfig, restartConfig } = serviceConfigSlice.actions;

export const selectCount = (state: RootState) => state.serviceConfig;

export default serviceConfigSlice.reducer;
