import { createStackNavigator } from '@react-navigation/stack';
<<<<<<< HEAD
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CheckEmailScreen } from '../screens/CheckEmailScreen';
=======
import React from 'react';
import { CheckEmail } from '../screens/CheckEmail';
>>>>>>> develop
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
  CheckEmail: undefined;
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
<<<<<<< HEAD
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="CheckEmailScreen" component={CheckEmailScreen} />
=======
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            initialParams={{ spikyService }}
          />
          <Stack.Screen name="CheckEmail" component={CheckEmail} />
>>>>>>> develop
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
