import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTime } from '../helpers/getTime';
import useSpikyService from '../hooks/useSpikyService';
import { RootStackParamList } from '../navigator/Navigator';
import { updateNotificationsNumber } from '../store/feature/user/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Notification as NotificationProps } from '../types/store';
import IconColor from './svg/IconColor';
import { RootState } from '../store';

interface PropsNotification {
    notification: NotificationProps;
    setModalNotif: (value: boolean) => void;
}

export const NotificationPrompt = ({ notification, setModalNotif }: PropsNotification) => {
    const { updateNotifications } = useSpikyService();
    const dispatch = useAppDispatch();
    const uid = useAppSelector((state: RootState) => state.user.id);
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const timestamp = new Date(notification.createdAt);
    const date = getTime(timestamp.getTime() + '');

    const handleOpenChat = async () => {
        if (!notification.seen && (await updateNotifications([notification.id]))) {
            dispatch(updateNotificationsNumber(-1));
        }
        if (notification.type === 12 && notification.notificationPrompt?.notification_random_chat) {
            navigation.navigate('ChatScreen', {
                conversationId: notification.notificationPrompt?.notification_random_chat?.chat.id,
                toUser:
                    notification.notificationPrompt?.notification_random_chat.chat.user_1.id !== uid
                        ? notification.notificationPrompt?.notification_random_chat.chat.user_1
                        : notification.notificationPrompt?.notification_random_chat.chat.user_2,
            });
        }
        setModalNotif(false);
    };

    return (
        <View style={[stylescom.container, !notification.seen && { backgroundColor: '#ffeadfcd' }]}>
            <View style={stylescom.circle}>
                <View style={{ width: 26, paddingRight: 4 }}>
                    <IconColor color={styles.text_button.color} underlayColor={'#01192E'} />
                </View>
            </View>
            <TouchableOpacity
                style={{ marginVertical: 8, marginLeft: 5, flex: 1 }}
                onPress={handleOpenChat}
            >
                <View style={styles.flex}>
                    <Text style={styles.flex_center}>
                        <Text style={{ ...styles.text, fontSize: 13 }}>
                            {notification.notificationPrompt?.title}
                        </Text>
                    </Text>
                </View>
                <View style={{ ...styles.flex, marginTop: 3, justifyContent: 'space-between' }}>
                    {notification.notificationPrompt && (
                        <Text style={{ ...styles.text, ...styles.textGray, fontSize: 11 }}>
                            {notification.notificationPrompt?.message.length > 32
                                ? notification.notificationPrompt?.message.substring(0, 25) + '...'
                                : notification.notificationPrompt?.message}
                        </Text>
                    )}
                    <Text style={{ ...styles.text, ...styles.textGray, fontSize: 11 }}>{date}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const stylescom = StyleSheet.create({
    user: {
        fontWeight: '600',
        fontSize: 13,
    },
    number: {
        fontWeight: '300',
        fontSize: 12,
        color: '#bebebe',
        marginLeft: 3,
    },
    wrapnew: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        ...styles.center,
        paddingRight: 10,
    },
    circle: {
        ...styles.center,
        height: 40,
        width: 40,
        borderRadius: 21,
        marginRight: 5,
        borderWidth: 3,
        borderColor: styles.button_container.backgroundColor,
        backgroundColor: styles.button_container.backgroundColor,
    },
    container: {
        ...styles.flex_start,
        width: '100%',
        borderRadius: 14,
        paddingHorizontal: 6,
        paddingVertical: 2,
        marginVertical: 4,
    },
});
