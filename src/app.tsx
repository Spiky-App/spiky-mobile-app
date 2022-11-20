import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ClickNotificationTypes } from './constants/notification';
import Container from './navigator/Container';
import { store } from './store';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
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
    const onMessage = () => {
        firebase.messaging().onMessage(response => {
            showNotification(response.data!.notification);
        });
    };

    const showNotification = (notification: any) => {
        PushNotification.localNotification({
            title: notification.title,
            message: notification.body!,
        });
    };

    getToken();
    onMessage();

    useEffect(() => {
        const type = 'notification';
        PushNotificationIOS.addEventListener(type, onRemoteNotification);
        return () => {
            PushNotificationIOS.removeEventListener(type);
        };
    });

    const onRemoteNotification = (notification: any) => {
        const isClicked = notification.getData().userInteraction === 1;
        if (isClicked) {
            // Navigate user to another screen
            const { data } = notification;
            switch (data.type) {
                case ClickNotificationTypes.GO_TO_CONVERSATION:
                    console.log('go to conversation #', data.conversationId);
                    break;
                case ClickNotificationTypes.GO_TO_IDEA:
                    console.log('go to idea #', data.ideaId);
                    break;
                default:
                // code block
            }
        }
        // Use the appropriate result based on what you needed to do for this notification
        const result = PushNotificationIOS.FetchResult.NoData;
        notification.finish(result);
    };
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <Container />
            </Provider>
        </SafeAreaProvider>
    );
};

export default App;
