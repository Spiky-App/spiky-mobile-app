import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Navigator } from './Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from '../types/storage';
import { bindActionCreators } from 'redux';
import authActions from '../store/actions/authActions';
import { useDispatch, useSelector } from 'react-redux';
import serviceActions from '../store/actions/serviceActions';
import { State } from '../store/reducers';

const Container = () => {
  const { spikyService } = useSelector((state: State) => state.service);
  const dispatch = useDispatch();

  const { signIn, setSpikyServiceConfig } = bindActionCreators(
    { ...authActions, ...serviceActions },
    dispatch
  );

  async function validateToken() {
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
  }

  useEffect(() => {
    validateToken();
  }, []);

  return (
    <NavigationContainer>
      <Navigator />
    </NavigationContainer>
  );
};

export default Container;
