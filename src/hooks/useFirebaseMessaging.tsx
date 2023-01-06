import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import { useCallback } from 'react';
import { StorageKeys } from '../types/storage';
import useSpikyService from './useSpikyService';

export const useFirebaseMessaging = () => {
    const { getNetworkConnectionStatus } = useSpikyService();

    const getTokenDevice = useCallback(async () => {
        const networkConnectionStatus = await getNetworkConnectionStatus();
        if (networkConnectionStatus) {
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
        }
    }, []);

    return { getTokenDevice };
};
