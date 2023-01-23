import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { StorageKeys } from '../types/storage';
import useSpikyService from './useSpikyService';

export const useFirebaseMessaging = (setBarStatus: (state: string) => void) => {
    const { getNetworkConnectionStatus } = useSpikyService();

    const getTokenDevice = useCallback(async () => {
        setBarStatus('checking network connectionn.');
        const networkConnectionStatus = await getNetworkConnectionStatus();
        if (networkConnectionStatus) {
            let token;
            try {
                setBarStatus('getting token from firebase.');
                token = await firebase
                    .messaging()
                    .getToken()
                    .catch(error => {
                        let err = `FCm token get error${error}`;
                        Alert.alert(err);
                    });
                setBarStatus('saving toke devive in storage (1).');
                if (token) await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, token);

                // Listen to whether the token changes
                setBarStatus('token refresh listener unsubscriber.');
                let tokenRefreshListenerUnsubscriber = firebase
                    .messaging()
                    .onTokenRefresh(async fcmToken => {
                        console.log(tokenRefreshListenerUnsubscriber);
                        await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, fcmToken);
                    });
            } catch (e) {
                console.log(e);
                try {
                    setBarStatus('requesting permission to firebase.');
                    await firebase.messaging().requestPermission();
                    setBarStatus('getting token from firebase (2).');
                    token = await firebase
                        .messaging()
                        .getToken()
                        .catch(error => {
                            let err = `FCm token get error${error}`;
                            Alert.alert(err);
                        });
                    setBarStatus('saving toke devive in storage (2).');
                    if (token) await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, token);
                } catch (error) {
                    console.log(error);
                    throw error;
                }
            }
        }
    }, []);

    return { getTokenDevice };
};
