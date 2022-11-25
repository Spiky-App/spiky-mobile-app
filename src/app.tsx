import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Container from './navigator/Container';
import { store } from './store';
import firebase from '@react-native-firebase/app';
import '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
//import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

const App = () => {
    const getToken = () => {
        firebase
            .messaging()
            .getToken()
            .then(x => console.log('token ->', Platform.OS, '-> ', x))
            .catch(e => console.log(e));
    };
    const onMessage = () => {
        firebase.messaging().onMessage(response => {
            showNotification(response.data!.notification);
        });
    };

    const showNotification = (notification: any) => {
        console.log('Showing notification');
        console.log(JSON.stringify(notification));
        PushNotification.localNotification({
            title: notification.title,
            message: notification.body!,
        });
    };

    getToken();
    onMessage();
    // const [permissions, setPermissions] = useState({});
    return (
        <SafeAreaProvider>
            <Provider store={store}>
                <Container />
            </Provider>
        </SafeAreaProvider>
    );
};

export default App;
