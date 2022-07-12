import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { HomeScreen } from '../screens/HomeScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { CheckEmail } from '../screens/CheckEmail';
import { ForgotPwdScreen } from '../screens/ForgotPwdScreen';
import { MenuMain } from './MenuMain';
import { RegisterScreen } from '../screens/RegisterScreen';

const Stack = createStackNavigator();

export const Navigator = () => {
  //Simulando la autenticacion
  const auth = true;

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
        <Stack.Screen name="MenuMain" component={MenuMain} />
      )}
    </Stack.Navigator>
  );
};
