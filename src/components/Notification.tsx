import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getTime } from '../helpers/getTime';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { updateNotificationsNumber } from '../store/feature/user/userSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Notification as NotificationProps } from '../types/store';

interface PropsNotification {
    notification: NotificationProps;
    setModalNotif: (value: boolean) => void;
}

const msg_notif = [
    '',
    'reacciono a tu idea.',
    'respondió a tu idea.',
    'respondió en tu tracking.',
    'te mencionó.',
    'reacciono a tu comentario.',
];

export const Notification = ({ notification, setModalNotif }: PropsNotification) => {
    const notificationNumber = useAppSelector((state: RootState) => state.user.notificationsNumber);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);
    const dispatch = useAppDispatch();
    const navigation = useNavigation<any>();
    const timestamp = new Date(notification.createdAt);
    const date = getTime(timestamp.getTime() + '');

    const ReturnMsg = (msg: string) => {
        const regexp_all = /(@\[@\w*\]\(\d*\))|(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))/g;
        const regexp_mention = /(@\[@\w*\]\(\d*\))/g;
        const regexp_hashtag = /(#\[#[A-Za-zÀ-ÖØ-öø-ÿ]+\]\(\d*\))/g;
        const mentions = msg.match(regexp_all);
        const mensaje_split = msg.split(regexp_all);
        let msg_final;
        let msg_trasnform: string[] = [];
        if (mentions) {
            mensaje_split.forEach(string => {
                if (string !== undefined) {
                    if (regexp_mention.test(string)) {
                        const alias = string.substring(
                            string.indexOf('[') + 1,
                            string.indexOf(']')
                        );
                        msg_trasnform.push(alias);
                    } else if (regexp_hashtag.test(string)) {
                        const hashtag = string.substring(
                            string.indexOf('[') + 1,
                            string.indexOf(']')
                        );
                        msg_trasnform.push(hashtag);
                    } else {
                        msg_trasnform.push(string);
                    }
                }
            });
            msg_final = msg_trasnform.join('');
        } else {
            msg_final = msg;
        }
        return msg_final;
    };

    const new_mensaje = ReturnMsg(notification.message);

    const handleOpenIdea = () => {
        service.updateNotifications([notification.id]);
        dispatch(updateNotificationsNumber(notificationNumber - 1));
        setModalNotif(false);
        navigation.navigate('OpenedIdeaScreen', {
            messageId: notification.messageId,
        });
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
                    <Text>
                        <Text style={{ ...styles.text, ...styles.h5, fontSize: 13 }}>
                            {'@' +
                                notification.user.nickname +
                                ' de ' +
                                notification.user.university.shortname +
                                ' '}
                        </Text>
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
