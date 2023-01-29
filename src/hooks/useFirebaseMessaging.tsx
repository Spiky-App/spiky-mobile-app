import AsyncStorage from '@react-native-async-storage/async-storage';
//import { firebase } from '@react-native-firebase/messaging';
import { useCallback } from 'react';
import { Alert } from 'react-native';
import { StorageKeys } from '../types/storage';
import useSpikyService from './useSpikyService';
import { Platform } from 'react-native';
import Messaging from '@react-native-firebase/messaging';
export const useFirebaseMessaging = () => {
    const { getNetworkConnectionStatus } = useSpikyService();

    const getToken = () => {
        Messaging()
            .getToken()
            .then(async tokenDevice => {
                await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, tokenDevice);
            })
            .catch(error => {
                let err = `FCm token get error${error}`;
                Alert.alert(err);
                console.log(err);
            });
    };
    const getTokenDevice = useCallback(async () => {
        const networkConnectionStatus = await getNetworkConnectionStatus();
        if (networkConnectionStatus) {
            if (Platform.OS === 'ios') {
                Messaging()
                    .requestPermission()
                    .then(status => {
                        const enabled =
                            status === Messaging.AuthorizationStatus.AUTHORIZED ||
                            status === Messaging.AuthorizationStatus.PROVISIONAL;
                        if (enabled) {
                            getToken();
                        }
                    });
            } else if (Platform.OS === 'android') {
                getToken();
            }
            Messaging().onTokenRefresh(async fcmToken => {
                await AsyncStorage.setItem(StorageKeys.DEVICE_TOKEN, fcmToken);
            });
        }
    }, []);

    return { getTokenDevice };
};
