import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { CheckEmail } from '../screens/CheckEmail';
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

export type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: undefined;
  CheckEmail: undefined;
  ForgotPwdScreen: undefined;
  RegisterScreen: undefined;
  MenuMain: undefined;
  CreateIdeaScreen: undefined;
  OpenedIdeaScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const Navigator = () => {
  //Simulando la autenticacion
  const { token } = useSelector((state: State) => state.auth);
  const { spikyService } = useSelector((state: State) => state.service);
  const dispatch = useDispatch();

  const { uiSetUniversities, getAllMessages } = bindActionCreators(
    { ...UIActions, ...messageActions },
    dispatch
  );

  async function setSessionInfo() {
    // retrieve the list of available universities
    try {
      const UniResponse = await spikyService.getUniversities();
      uiSetUniversities(UniResponse.data);
    } catch {
      console.log('Error uni');
    }
    try {
      // retrieve the list of ideas
      const messagesResponse = await spikyService.getIdeas();
      getAllMessages(messagesResponse.data);
    } catch {
      console.log('Error messages');
    }
  }

  useEffect(() => {
    if (token) {
      setSessionInfo();
    }
  }, [token]);

  console.log("Navigator: ", token?.length);

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
          <Stack.Screen name="CheckEmail" component={CheckEmail} />
          <Stack.Screen name="ForgotPwdScreen" component={ForgotPwdScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
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
