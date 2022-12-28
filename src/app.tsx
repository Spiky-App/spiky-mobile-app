import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Container from './navigator/Container';
import { store } from './store';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from './types/storage';

const App = () => {
    const getToken = async () => {
        let token;
        try {
            token = await firebase.messaging().getToken();
            await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, token);

            // Listen to whether the token changes
            let tokenRefreshListenerUnsubscriber = firebase
                .messaging()
                .onTokenRefresh(async fcmToken => {
                    console.log(tokenRefreshListenerUnsubscriber);
                    await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, fcmToken);
                });
        } catch (e) {
            try {
                await firebase.messaging().requestPermission();
                token = await firebase.messaging().getToken();
                await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, token);
            } catch (error) {
                throw error;
            }
        }
    };
    useEffect(() => {
        getToken();
    }, []);

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <Container />
            </Provider>
        </SafeAreaProvider>
    );
};

export default App;
