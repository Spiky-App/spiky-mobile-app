import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Container from './navigator/Container';
import { store } from './store';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKeys } from './types/storage';

const App = () => {
    const getToken = () => {
        firebase
            .messaging()
            .getToken()
            .then(async x => {
                await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, x);
            })
            .catch(e => console.log(e));
    };

    getToken();

    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <Container />
            </Provider>
        </SafeAreaProvider>
    );
};

export default App;
