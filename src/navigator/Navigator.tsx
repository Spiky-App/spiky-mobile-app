import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { CheckEmailScreen } from '../screens/CheckEmailScreen';
import { ForgotPwdScreen } from '../screens/ForgotPwdScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import SpikyService from '../services/SpikyService';
import { MenuMain } from './MenuMain';
import { CreateIdeaScreen } from '../screens/CreateIdeaScreen';
import { useSelector } from 'react-redux';
import { State } from '../store/reducers';
import { OpenedIdeaScreen } from '../screens/OpenedIdeaScreen';
import { Animated } from 'react-native';

export type RootStackParamList = {
  HomeScreen: { spikyService: SpikyService };
  LoginScreen: { spikyService: SpikyService };
  CheckEmailScreen: undefined;
  ForgotPwdScreen: undefined;
  RegisterScreen: undefined;
  MenuMain: undefined;
  CreateIdeaScreen: undefined;
  OpenedIdeaScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface Props {
  spikyService: SpikyService;
}

export const Navigator = ({ spikyService }: Props) => {
  //Simulando la autenticacion
  const auth = useSelector((state: State) => state.auth);
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      {!auth.token ? (
        <>
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            initialParams={{ spikyService }}
          />
          <Stack.Screen name="CheckEmailScreen" component={CheckEmailScreen} />
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
