import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTime } from '../helpers/getTime';
import { transformMsg } from '../helpers/transformMsg';
import useSpikyService from '../hooks/useSpikyService';
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
    'reaccionó a tu idea.',
    'respondió a tu idea.',
    'respondió en tu tracking.',
    'te mencionó.',
    'reaccionó a tu comentario.',
];

export const Notification = ({ notification, setModalNotif }: PropsNotification) => {
    const { updateNotifications } = useSpikyService();
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const timestamp = new Date(notification.createdAt);
    const date = getTime(timestamp.getTime() + '');

    const new_mensaje = transformMsg(notification.message);

    const handleOpenIdea = async () => {
        if (!notification.seen && (await updateNotifications([notification.id]))) {
            dispatch(updateNotificationsNumber(-1));
        }
        navigation.navigate('OpenedIdeaScreen', {
            messageId: notification.messageId,
        });
        setModalNotif(false);
    };

    return (
        <View>
            {!notification.seen && (
                <View style={stylescom.wrapnew}>
                    <View style={stylescom.new} />
                </View>
            )}

            <TouchableOpacity
                style={{ marginVertical: 10, marginLeft: 18 }}
                onPress={handleOpenIdea}
            >
                <View style={styles.flex}>
                    <Text style={styles.flex}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={{ ...styles.text, ...styles.h5, fontSize: 13 }}>
                                {'@' + notification.user.nickname}
                            </Text>
                            <UniversityTag id={notification.user.universityId} fontSize={13} />
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
    new: {
        backgroundColor: '#FC702A',
        height: 15,
        width: 15,
        borderRadius: 100,
    },
});
