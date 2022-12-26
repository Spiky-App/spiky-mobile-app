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
import { setMessages } from '../store/feature/messages/messagesSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import useSpikyService from '../hooks/useSpikyService';
import { Message, User } from '../types/store';
import { RootStackParamList } from '../navigator/Navigator';

interface Props {
    setIdeaOptions: (value: boolean) => void;
    ideaOptions: boolean;
    myIdea: boolean;
    position: {
        top: number;
        left: number;
    };
    message: {
        messageId: number;
        message: string;
        user: User;
        date: number;
        messageTrackingId?: number;
    };
    setMessageTrackingId?: (value: number | undefined) => void;
    filter?: string;
}

export const ModalIdeaOptions = ({
    setIdeaOptions,
    ideaOptions,
    myIdea,
    position,
    message,
    setMessageTrackingId,
    filter,
}: Props) => {
    const { top, left } = position;
    const uid = useAppSelector((state: RootState) => state.user.id);
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const { deleteIdea } = useSpikyService();
    const { createTracking, deleteTracking } = useSpikyService();
    const { messageId, messageTrackingId } = message;

    const goToScreen = (
        screen: string,
        params?: RootStackParamList['ReplyIdeaScreen'] | RootStackParamList['ReportIdeaScreen']
    ) => {
        setIdeaOptions(false);
        navigation.navigate(screen, params);
    };

    async function handleCreateTracking() {
        const id_tracking = await createTracking(messageId, uid);
        if (id_tracking) {
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
        }
        if (setMessageTrackingId) setMessageTrackingId(id_tracking);
    }

    async function handleDeleteTracking() {
        const isDeleted = await deleteTracking(messageId);
        if (isDeleted) {
            let messagesUpdated: Message[];
            if (filter === '/tracking') {
                messagesUpdated = messages.filter(msg => msg.id !== messageId);
            } else {
                messagesUpdated = messages.map(msg => {
                    if (msg.id === messageId) {
                        return { ...msg, messageTrackingId: undefined };
                    } else {
                        return msg;
                    }
                });
            }
            dispatch(
                setModalAlert({ isOpen: true, text: 'Tracking desactivado', icon: faThumbtack })
            );
            dispatch(setMessages(messagesUpdated));
            if (setMessageTrackingId) setMessageTrackingId(undefined);
        }
    }

    async function handleTracking() {
        if (!messageTrackingId) {
            await handleCreateTracking();
        } else {
            await handleDeleteTracking();
        }
        setIdeaOptions(false);
    }

    const handleDelete = () => {
        deleteIdea(messageId);
        const messagesUpdated = messages.filter(msg => msg.id !== messageId);
        dispatch(setMessages(messagesUpdated));
        dispatch(setModalAlert({ isOpen: true, text: 'Idea eliminada', icon: faEraser }));
        setIdeaOptions(false);
        if (setMessageTrackingId) navigation.goBack();
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
                        <View style={{ ...stylescomp.container, top: top + 20, left: left - 100 }}>
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

                                    <TouchableOpacity
                                        style={stylescomp.button}
                                        onPress={() =>
                                            goToScreen('ReplyIdeaScreen', {
                                                message: {
                                                    messageId: message.messageId,
                                                    message: message.message,
                                                    user: message.user,
                                                    date: message.date,
                                                },
                                            })
                                        }
                                    >
                                        <FontAwesomeIcon icon={faReply} color="#01192E" size={13} />
                                        <Text style={stylescomp.text}> Replicar en priv</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={stylescomp.button}
                                        onPress={() =>
                                            goToScreen('ReportIdeaScreen', {
                                                messageId: message.messageId,
                                            })
                                        }
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
        backgroundColor: 'white',
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
        minWidth: 160,
    },
    text: {
        ...styles.text,
        fontSize: 15,
        marginLeft: 8,
        paddingVertical: 6,
    },
    button: {
        ...styles.flex,
        ...styles.center,
        paddingHorizontal: 14,
        paddingVertical: 5,
    },
});
