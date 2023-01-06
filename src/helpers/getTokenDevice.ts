import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import { useCallback } from 'react';
import { StorageKeys } from '../types/storage';

export const getTokenDevice = useCallback(async () => {
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
        console.log(e);
        try {
            await firebase.messaging().requestPermission();
            token = await firebase.messaging().getToken();
            await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, token);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}, []);
