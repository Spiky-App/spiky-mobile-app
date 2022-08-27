import React from 'react';
import {
    Modal,
    Text,
    TouchableWithoutFeedback,
    View,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBan, faEraser, faReply, faThumbtack, faTrashCan } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SpikyService from '../services/SpikyService';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';

interface Props {
    setIdeaOptions: (value: boolean) => void;
    ideaOptions: boolean;
    myIdea: boolean;
    position: {
        top: number;
        left: number;
    };
    messageId: number;
    messageTrackingId?: number;
}

export const ModalIdeaOptions = ({
    setIdeaOptions,
    ideaOptions,
    myIdea,
    position,
    messageId,
    messageTrackingId,
}: Props) => {
    const { top, left } = position;
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const uid = useAppSelector((state: RootState) => state.user.id);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const service = new SpikyService(config);

    const goToScreen = (screen: string) => {
        setIdeaOptions(false);
        navigation.navigate(screen);
    };

    const handleTracking = async () => {
        if (!messageTrackingId) {
            const response = await service.createTracking(uid, messageId);
            const { data } = response;
            const { id_tracking } = data;

            const messagesUpdated = messages.map(msg => {
                if (msg.id === messageId) {
                    return { ...msg, messageTrackingId: id_tracking };
                } else {
                    return msg;
                }
            });
            dispatch(
                setModalAlert({
                    isOpen: true,
                    text: 'Tracking activado',
                    color: '#FC702A',
                    icon: faThumbtack,
                })
            );
            dispatch(setMessages(messagesUpdated));
        } else {
            await service.deleteTracking(messageTrackingId);

            const messagesUpdated = messages.map(msg => {
                if (msg.id === messageId) {
                    return { ...msg, messageTrackingId: undefined };
                } else {
                    return msg;
                }
            });
            dispatch(
                setModalAlert({ isOpen: true, text: 'Tracking desactivado', icon: faThumbtack })
            );
            dispatch(setMessages(messagesUpdated));
        }
        setIdeaOptions(false);
    };

    const handleDelete = async () => {
        const response = await service.deleteMessage(messageId);
        const { data } = response;
        const { msg: msgAlert } = data;

        const messagesUpdated = messages.filter(msg => msg.id !== messageId);
        dispatch(setMessages(messagesUpdated));
        dispatch(setModalAlert({ isOpen: true, text: msgAlert, icon: faEraser }));
        setIdeaOptions(false);
    };

    return (
        <Modal animationType="fade" visible={ideaOptions} transparent={true}>
            <TouchableWithoutFeedback onPress={() => setIdeaOptions(false)}>
                <View
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <TouchableWithoutFeedback>
                        <View style={{ ...stylescomp.container, top: top, left: left - 110 }}>
                            {!myIdea ? (
                                <>
                                    <TouchableOpacity
                                        style={stylescomp.button}
                                        onPress={handleTracking}
                                    >
                                        <FontAwesomeIcon
                                            icon={faThumbtack}
                                            color="#01192E"
                                            size={13}
                                        />
                                        <Text style={stylescomp.text}>Tracking</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity style={stylescomp.button} onPress={() => {}}>
                                        <FontAwesomeIcon icon={faReply} color="#01192E" size={13} />
                                        <Text style={stylescomp.text}> Replicar en priv</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={stylescomp.button}
                                        onPress={() => goToScreen('ReportIdeaScreen')}
                                    >
                                        <FontAwesomeIcon icon={faBan} color="#01192E" size={12} />
                                        <Text style={stylescomp.text}>Reportar</Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <>
                                    <TouchableOpacity
                                        style={stylescomp.button}
                                        onPress={handleDelete}
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrashCan}
                                            color="#01192E"
                                            size={13}
                                        />
                                        <Text style={stylescomp.text}>Eliminar</Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const stylescomp = StyleSheet.create({
    container: {
        backgroundColor: '#ffff',
        paddingVertical: 3,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 7,
        borderRadius: 5,
        alignItems: 'flex-start',
        position: 'absolute',
        width: 150,
    },
    text: {
        ...styles.text,
        fontSize: 13,
        marginLeft: 8,
        paddingVertical: 6,
    },
    button: {
        ...styles.flex,
        ...styles.center,
        paddingHorizontal: 14,
    },
});
