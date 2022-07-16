import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { CheckEmail } from '../screens/CheckEmail';
import { ForgotPwdScreen } from '../screens/ForgotPwdScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import SpikyService from '../services/SpikyService';
import { MenuMain } from './MenuMain';
import { CreateIdeaScreen } from '../screens/CreateIdeaScreen';
import { useSelector } from 'react-redux';
import { State } from '../store/reducers'

export type RootStackParamList = {
  HomeScreen: undefined;
  LoginScreen: { spikyService: SpikyService };
  CheckEmail: undefined;
  ForgotPwdScreen: undefined;
  RegisterScreen: undefined;
  MenuMain: undefined;
  CreateIdeaScreen: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface Props {
  spikyService: SpikyService;
}

export const Navigator = ({ spikyService }: Props) => {
  //Simulando la autenticacion
  const auth = useSelector((state: State) => state.auth);
  console.log(auth);
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
          <Stack.Screen name="CheckEmail" component={CheckEmail} />
          <Stack.Screen name="ForgotPwdScreen" component={ForgotPwdScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MenuMain" component={MenuMain} />
          <Stack.Screen name="CreateIdeaScreen" component={CreateIdeaScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};
