import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Text,
    FlatList,
    TouchableOpacity,
} from 'react-native';
import { generateNotificationsFromNotificacion } from '../helpers/notification';
import SpikyService from '../services/SpikyService';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { Notification as NotificationProps } from '../types/store';
import { Notification } from './Notification';
import { LoadingAnimated } from './svg/LoadingAnimated';

interface Props {
    setModalNotif: (value: boolean) => void;
    modalNotif: boolean;
}

export const ModalNotification = ({ modalNotif, setModalNotif }: Props) => {
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState<NotificationProps[]>([]);

    const getNotifications = async () => {
        const response = await service.getNotifications();
        const { data } = response;
        const { notificaciones } = data;
        const notificacionesRetrived = notificaciones.map(n =>
            generateNotificationsFromNotificacion(n)
        );
        setNotifications(notificacionesRetrived);
        setLoading(false);
    };

    useEffect(() => {
        if (modalNotif) {
            setLoading(true);
            getNotifications();
        }
    }, [modalNotif]);

    return (
        <Modal animationType="fade" visible={modalNotif} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setModalNotif(false)}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <View
                            style={{
                                ...stylescom.container,
                                paddingHorizontal: 25,
                                paddingVertical: 15,
                            }}
                        >
                            <View style={{ ...styles.flex, justifyContent: 'space-between' }}>
                                <Text style={{ ...styles.text, ...styles.h3 }}>
                                    Notificaciones
                                    <Text style={styles.orange}>.</Text>
                                </Text>

                                <TouchableOpacity style={styles.center} onPress={() => {}}>
                                    <Text
                                        style={{
                                            ...styles.text,
                                            ...styles.link,
                                            textAlign: 'right',
                                        }}
                                    >
                                        Limpiar
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            <View
                                style={{
                                    marginHorizontal: 5,
                                    marginTop: 20,
                                    marginBottom: 35,
                                    flex: 1,
                                }}
                            >
                                {loading ? (
                                    <View style={{ ...styles.center, flex: 1 }}>
                                        <LoadingAnimated />
                                    </View>
                                ) : notifications?.length !== 0 ? (
                                    <FlatList
                                        data={notifications}
                                        renderItem={({ item }) => <Notification item={item} />}
                                        keyExtractor={item => item.id + ''}
                                        showsVerticalScrollIndicator={false}
                                    />
                                ) : (
                                    <View style={{ ...styles.center, flex: 1 }}>
                                        <Text
                                            style={{
                                                ...styles.text,
                                                ...styles.textGrayPad,
                                                textAlign: 'center',
                                            }}
                                        >
                                            No tienes notificaciones.
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: 360,
        width: 300,
        backgroundColor: '#ffff',
        borderRadius: 5,
    },
});
