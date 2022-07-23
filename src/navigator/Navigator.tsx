import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CheckEmailScreen } from '../screens/CheckEmailScreen';
import { ForgotPwdScreen } from '../screens/ForgotPwdScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { MenuMain } from './MenuMain';
import { CreateIdeaScreen } from '../screens/CreateIdeaScreen';
import { useDispatch, useSelector } from 'react-redux';
import { State } from '../store/reducers';
import { OpenedIdeaScreen } from '../screens/OpenedIdeaScreen';
import { bindActionCreators } from 'redux';
import messageActions from '../store/actions/messageActions';
import UIActions from '../store/actions/UIActions';
import SpikyService from '../services/SpikyService';
import { ManifestPart1Screen } from '../screens/ManifestPart1Screen';

export type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: undefined;
  CheckEmail: undefined;
  CheckEmailScreen: undefined;
  ForgotPwdScreen: undefined;
  RegisterScreen: undefined;
  MenuMain: undefined;
  CreateIdeaScreen: undefined;
  OpenedIdeaScreen: undefined;
  ManifestPart1Screen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigator = () => {
  const { token } = useSelector((state: State) => state.auth);
  const { spikyServiceConfig } = useSelector((state: State) => state.service);
  const { universities } = useSelector((state: State) => state.ui);
  const { mensajes } = useSelector((state: State) => state.message);
  const spikyService = new SpikyService(spikyServiceConfig);
  const dispatch = useDispatch();

  const { uiSetUniversities, getAllMessages } = bindActionCreators(
    { ...UIActions, ...messageActions },
    dispatch
  );

  async function setSessionInfo() {
    try {
      const UniResponse = await spikyService.getUniversities();
      uiSetUniversities(UniResponse.data);
    } catch {
      console.log('Error uni');
    }
    try {
      const messagesResponse = await spikyService.getIdeas();
      getAllMessages(messagesResponse.data);
    } catch {
      console.log('Error messages');
    }
  }

  useEffect(() => {
    if (token && !universities && !mensajes) {
      setSessionInfo();
    }
  }, [token]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      {!token ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="CheckEmailScreen" component={CheckEmailScreen} />
          <Stack.Screen name="ForgotPwdScreen" component={ForgotPwdScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
          <Stack.Screen name="ManifestPart1Screen" component={ManifestPart1Screen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MenuMain" component={MenuMain} />
          <Stack.Screen name="CreateIdeaScreen" component={CreateIdeaScreen} />
          <Stack.Screen name="OpenedIdeaScreen" component={OpenedIdeaScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
