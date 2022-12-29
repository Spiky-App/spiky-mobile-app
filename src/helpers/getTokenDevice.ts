import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/messaging';
import { StorageKeys } from '../types/storage';

export const getTokenDevice = async () => {
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
