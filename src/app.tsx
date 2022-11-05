import PushNotificationIOS from '@react-native-community/push-notification-ios';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { ClickNotificationTypes } from './constants/notification';
import Container from './navigator/Container';
import { notificationService } from './services/NotificationService';
import { store } from './store';

const App = () => {
    // const [permissions, setPermissions] = useState({});
    notificationService.configure();
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
            console.log(notification.data, ' ----> REMOTE NOTIFICATION');
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
        } else {
            // Do something else with push notification
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
