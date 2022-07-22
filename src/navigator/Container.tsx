import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../types/storage';
import { bindActionCreators } from 'redux';
import authActions from '../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import serviceActions from '../store/actions/serviceActions';
import { State } from '../store/reducers';
import SpikyService from '../services/SpikyService';
import SplashScreen from '../screens/SplashScreen';

const Container = () => {
  const { spikyServiceConfig } = useSelector((state: State) => state.service);
  const spikyService = new SpikyService(spikyServiceConfig);
  const dispatch = useDispatch();
  const [isLoading, setLoading] = useState(false);

  const { signIn, setSpikyServiceConfig } = bindActionCreators(
    { ...authActions, ...serviceActions },
    dispatch
  );

  async function validateToken() {
    setLoading(true);
    const tokenStorage = await AsyncStorage.getItem(StorageKeys.TOKEN);
    if (tokenStorage) {
      try {
        const response = await spikyService.getAuthRenew(tokenStorage);
        const { data } = response;
        const { token } = data;
        await AsyncStorage.setItem(StorageKeys.TOKEN, token);
        signIn(token);
        setSpikyServiceConfig({ headers: { 'x-token': token } });
      } catch {
        await AsyncStorage.removeItem(StorageKeys.TOKEN);
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    validateToken();
  }, []);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};

export default Container;
