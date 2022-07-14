import { NavigationContainer } from '@react-navigation/native';
import { AxiosRequestConfig } from 'axios';
import React from 'react';
import { Provider } from 'react-redux';
import { Navigator } from './navigator/Navigator';
import SpikyService from './services/SpikyService';
import store from './store';

const App = () => {
  const host = 'http://localhost:4000';
  const config: AxiosRequestConfig = {
    baseURL: `${host}/api/`,
  };
  const spikyService = new SpikyService(config);
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator spikyService={spikyService}/>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
