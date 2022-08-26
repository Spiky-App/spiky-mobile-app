import React from 'react';
import { Modal, Text, TouchableWithoutFeedback, View, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faBan, faReply, faThumbtack, faTrashCan } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SpikyService from '../services/SpikyService';
import { setMessages } from '../store/feature/messages/messagesSlice';

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
                    msg.messageTrackingId = id_tracking;
                }
                return msg;
            });
            dispatch(setMessages(messagesUpdated));
        } else {
            await service.deleteTracking(messageTrackingId);

            const messagesUpdated = messages.map(msg => {
                if (msg.id === messageId) {
                    msg.messageTrackingId = undefined;
                }
                return msg;
            });
            dispatch(setMessages(messagesUpdated));
        }
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
                        <View
                            style={{
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
                                top: top,
                                left: left - 110,
                            }}
                        >
                            {!myIdea ? (
                                <>
                                    <TouchableOpacity
                                        style={{
                                            ...styles.flex,
                                            ...styles.center,
                                            paddingHorizontal: 14,
                                        }}
                                        onPress={handleTracking}
                                    >
                                        <FontAwesomeIcon
                                            icon={faThumbtack}
                                            color="#01192E"
                                            size={13}
                                        />
                                        <Text
                                            style={{
                                                ...styles.text,
                                                fontSize: 13,
                                                marginLeft: 8,
                                                paddingVertical: 6,
                                            }}
                                        >
                                            Tracking
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            ...styles.flex,
                                            ...styles.center,
                                            paddingHorizontal: 14,
                                        }}
                                        onPress={() => {}}
                                    >
                                        <FontAwesomeIcon icon={faReply} color="#01192E" size={13} />
                                        <Text
                                            style={{
                                                ...styles.text,
                                                fontSize: 13,
                                                marginLeft: 8,
                                                paddingVertical: 6,
                                            }}
                                        >
                                            Replicar en priv
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{
                                            ...styles.flex,
                                            ...styles.center,
                                            paddingHorizontal: 14,
                                        }}
                                        onPress={() => goToScreen('ReportIdeaScreen')}
                                    >
                                        <FontAwesomeIcon icon={faBan} color="#01192E" size={12} />
                                        <Text
                                            style={{
                                                ...styles.text,
                                                fontSize: 13,
                                                marginLeft: 8,
                                                paddingVertical: 6,
                                            }}
                                        >
                                            Reportar
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <TouchableOpacity
                                    style={{
                                        ...styles.flex,
                                        ...styles.center,
                                        paddingHorizontal: 14,
                                    }}
                                    onPress={() => {}}
                                >
                                    <FontAwesomeIcon icon={faTrashCan} color="#01192E" size={13} />
                                    <Text
                                        style={{
                                            ...styles.text,
                                            fontSize: 13,
                                            marginLeft: 8,
                                            paddingVertical: 6,
                                        }}
                                    >
                                        Eliminar
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};
