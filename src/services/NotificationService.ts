import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { ClickNotificationTypes } from '../constants/notification';
class NotificationService {
    AndroidOptions: {
        largeIcon: string;
        smallIcon: string;
        vibration: number;
        vibrate: boolean;
        priority: string;
        importance: string;
    };
    IosOptions: {
        alertAction: string;
        category: string;
    };
    lastId: number;
    lastChannelCounter: number;
    constructor() {
        this.lastId = 0;
        this.lastChannelCounter = 0;
        this.AndroidOptions = {
            largeIcon: 'ic_launcher',
            smallIcon: 'ic_launcher',
            vibration: 300,
            vibrate: true,
            priority: 'high',
            importance: 'high',
        };
        this.IosOptions = {
            alertAction: 'view',
            category: '',
        };

        // Clear badge number at start
        PushNotification.getApplicationIconBadgeNumber(function (number) {
            if (number > 0) {
                PushNotification.setApplicationIconBadgeNumber(0);
            }
        });

        PushNotification.getChannels(function (channels) {
            console.log(channels);
        });
    }
    configure = () => {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                console.log('TOKEN:', token);
            },

            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                // process the notification
                if (notification.userInteraction) {
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
                // (required) Called when a remote is received or opened, or local notification is opened
                notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
            onAction: function (notification) {
                console.log('ACTION:', notification.action);
                console.log('NOTIFICATION:', notification);
                // process the action
            },

            // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
            onRegistrationError: function (err) {
                console.error(err.message, err);
            },

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            // default: true

            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             * - if you are not using remote notification or do not have Firebase installed, use this:
             *     requestPermissions: Platform.OS === 'ios'
             */

            requestPermissions: true,
        });
        PushNotification.createChannel(
            {
                channelId: 'fcm_fallback_notification_channel', // (required)
                channelName: 'Channel', // (required)
            },
            created => console.log(`createChannel returned '${created}`)
        );
    };

    buildAdroidNotification = (id: number, title: string, message: string, data = {}) => {
        return {
            id: id,
            autoCancel: true,
            bigText: message || '',
            subText: title || '',
            ...this.AndroidOptions,
            data: data,
        };
    };
    buildIOSNotification = (id: number, data = {}) => {
        return {
            ...this.IosOptions,
            userInfo: {
                id: id,
                item: data,
            },
        };
    };
    cancelAllNotification = () => {
        console.log('cancel');
        PushNotification.cancelAllLocalNotifications();
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        }
    };

    showNotification = (
        id: number,
        title: string,
        message: string,
        data = {}
        /*options = {},
        date: Date */
    ) => {
        PushNotification.localNotification({
            /* Android Only Properties */
            channelId: 'your-channel-id', // (required) channelId, if the channel doesn't exist, notification will not trigger.
            ticker: 'My Notification Ticker', // (optional)
            showWhen: true, // (optional) default: true
            autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher',
            smallIcon: 'ic_notification',
            bigText: title,
            subText: message,
            bigLargeIcon: 'ic_launcher', // (optional) default: undefined
            color: 'orange',
            vibrate: true,
            vibration: 300,
            groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
            ongoing: false, // (optional) set whether this is an "ongoing" notification
            priority: 'high',
            visibility: 'private',
            ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
            shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined

            when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
            usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
            timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

            messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

            actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
            invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

            /* iOS and Android properties */
            //id: id + '', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
            title: title, // (optional)
            message: message, // (required)
            userInfo: data, // (optional) default: {} (using null throws a JSON value '<null>' error)
            playSound: true,
            soundName: 'default',
        });
    };
    unregister = () => {
        PushNotification.unregister();
    };
}
export const notificationService = new NotificationService();
