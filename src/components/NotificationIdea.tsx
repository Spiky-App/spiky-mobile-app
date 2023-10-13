import { NavigationProp, useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTime } from '../helpers/getTime';
import { transformMsg } from '../helpers/transformMsg';
import useSpikyService from '../hooks/useSpikyService';
import { RootStackParamList } from '../navigator/Navigator';
import { updateNotificationsNumber } from '../store/feature/user/userSlice';
import { useAppDispatch } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Notification as NotificationProps } from '../types/store';
import UniversityTag from './common/UniversityTag';

interface PropsNotification {
    notification: NotificationProps;
    setModalNotif: (value: boolean) => void;
}

const msg_notif = [
    '',
    'reaccionó a tu idea',
    'respondió a tu idea',
    'respondió en tu tracking',
    'te mencionó',
    'reaccionó a tu comentario',
    'reaccionó en tu tracking',
    'contestó tu encuesta',
    'contestó en tu tracking',
    'reaccionó x2',
    'reaccionó x2 en tu tracking',
    'participó en la publicación',
];

export const NotificationIdea = ({ notification, setModalNotif }: PropsNotification) => {
    const { updateNotifications } = useSpikyService();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const timestamp = new Date(notification.createdAt);
    const date = getTime(timestamp.getTime() + '');

    const messageToConvert = notification.notificationIdea?.comment
        ? notification.notificationIdea?.comment?.message
        : notification.notificationIdea?.idea?.message;

    const new_mensaje = transformMsg(messageToConvert ? messageToConvert : '');

    const handleOpenIdea = async () => {
        if (!notification.seen && (await updateNotifications([notification.id]))) {
            dispatch(updateNotificationsNumber(-1));
        }
        if (notification.notificationIdea?.idea.id) {
            navigation.navigate('OpenedIdeaScreen', {
                ideaId: notification.notificationIdea?.idea.id,
            });
        }
        setModalNotif(false);
    };

    return (
        <View style={[stylescom.container, !notification.seen && { backgroundColor: '#ffeadfcd' }]}>
            <View style={stylescom.circle}>
                <Text style={[styles.h7, { color: styles.text_button.color }]}>
                    {notification.notificationIdea?.user.nickname.substring(0, 2).toUpperCase()}
                </Text>
            </View>
            <TouchableOpacity
                style={{ marginVertical: 8, marginLeft: 5, flex: 1 }}
                onPress={handleOpenIdea}
            >
                <View style={styles.flex}>
                    <Text style={styles.flex_center}>
                        <View style={{ flexDirection: 'row', marginRight: 5 }}>
                            <Text style={{ ...styles.text, ...styles.h5, fontSize: 13 }}>
                                {notification.notificationIdea?.user.nickname}
                            </Text>
                            {notification.notificationIdea?.user.universityId && (
                                <UniversityTag
                                    id={notification.notificationIdea?.user.universityId}
                                    fontSize={13}
                                />
                            )}
                        </View>
                        <Text style={{ ...styles.text, fontSize: 13 }}>
                            {msg_notif[notification.type]}
                        </Text>
                    </Text>
                </View>
                <View style={{ ...styles.flex, marginTop: 3, justifyContent: 'space-between' }}>
                    <Text style={{ ...styles.text, ...styles.textGray, fontSize: 11 }}>
                        {new_mensaje.length > 32
                            ? new_mensaje.substring(0, 25) + '...'
                            : new_mensaje}
                    </Text>
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
