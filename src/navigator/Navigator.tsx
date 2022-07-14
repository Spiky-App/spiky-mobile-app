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

const Stack = createStackNavigator();

interface Props {
  spikyService: SpikyService;
}

export const Navigator = ({spikyService}: Props) => {
  //Simulando la autenticacion
  const auth = false;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white',
        },
      }}
    >
      {!auth ? (
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
        </>
      )}
    </Stack.Navigator>
  );
};
