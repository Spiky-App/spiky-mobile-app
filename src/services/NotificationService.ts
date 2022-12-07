import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';
import PushNotification from 'react-native-push-notification';
import { ClickNotificationTypes } from '../constants/notification';
import messaging from '@react-native-firebase/messaging';

import * as RootNavigation from '../helpers/navigator';

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
        PushNotification.createChannel(
            {
                channelId: 'fcm_fallback_notification_channel', // (required)
                channelName: 'Channel', // (required)
                playSound: false, // (optional) default: true
                soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
                importance: 4, // (optional) default: 4. Int value of the Android notification importance
                vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
            },
            // if it returns false that means the channel already existed. Also you don't have to call the last line, it's optional
            created => console.log(`createChannel returned '${created}'`)
        );

        PushNotification.getChannels(function (channels) {
            console.log(`channels: '${channels}'`);
        });
    }
    configure = () => {
        PushNotification.configure({
            // (required) Called when a remote is received or opened, or local notification is opened
            onNotification: function (notification) {
                // OpenedIdeaScreen receives route params (id, filter), used in Idea component, for example. Idea < MessageFeed Fatlist < Community Screen
                // process the notification
                if (notification.userInteraction) {
                    const { data } = notification;
                    // data in remote notifs is defined in pushNotification func in the server
                    console.log('onNotif', data, notification);
                    // isRemote is 1 from background, and undefined in local notifs
                    console.log('isRemote', data.isRemote);
                    let type = data.type;
                    typeof type === 'string' ? (type = parseInt(type)) : (type = data.type);
                    let routeParams = {};
                    switch (type) {
                        case ClickNotificationTypes.GO_TO_CONVERSATION:
                            if (!data.isRemote) {
                                routeParams = {
                                    conversationId: data.conversationId,
                                    toUser: data.toUser,
                                };
                            } else {
                                routeParams = {
                                    conversationId: data.contentId,
                                    toUser: {
                                        id: data.userId,
                                        nickname: data.userAlias,
                                        universityId: parseInt(data.userUniId),
                                        online: Boolean(JSON.parse(data.userIsOnline)),
                                    },
                                };
                            }
                            RootNavigation.navigate('ChatScreen', routeParams);
                            break;
                        case ClickNotificationTypes.GO_TO_IDEA:
                            if (!data.isRemote) {
                                routeParams = {
                                    messageId: data.ideaId,
                                    filter: '',
                                };
                            } else {
                                routeParams = {
                                    messageId: data.contentId,
                                    filter: '',
                                };
                            }
                            RootNavigation.navigate('OpenedIdeaScreen', routeParams);
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
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);
        });
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
            channelId: 'fcm_fallback_notification_channel', // (required) channelId, if the channel doesn't exist, notification will not trigger.
            // autoCancel: true, // (optional) default: true
            largeIcon: 'ic_launcher',
            smallIcon: 'ic_launcher',
            vibration: 300,
            vibrate: true,
            priority: 'high',
            importance: 'high',
            // messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

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
