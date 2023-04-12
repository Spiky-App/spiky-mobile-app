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
import {
    faBan,
    faEraser,
    faReply,
    faThumbsDown,
    faThumbtack,
    faTrashCan,
} from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import useSpikyService from '../hooks/useSpikyService';
import { Message, User, IdeaType } from '../types/store';
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
        ideaId: number;
        message: string;
        user: User;
        date: number;
        messageTrackingId?: number;
        anonymous: boolean;
    };
    setMessageTrackingId?: (value: number | undefined) => void;
    filter?: string;
    isOpenedIdeaScreen?: boolean;
    ideaType: IdeaType;
}

export const ModalIdeaOptions = ({
    setIdeaOptions,
    ideaOptions,
    myIdea,
    position,
    message,
    setMessageTrackingId,
    filter,
    isOpenedIdeaScreen,
    ideaType,
}: Props) => {
    const { top, left } = position;
    const uid = useAppSelector((state: RootState) => state.user.id);
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const { deleteIdea, createReportIdea } = useSpikyService();
    const { createTracking, deleteTracking } = useSpikyService();
    const { ideaId, messageTrackingId } = message;

    const goToScreen = (
        screen: string,
        params?:
            | RootStackParamList['ReplyIdeaScreen']
            | RootStackParamList['ReportIdeaScreen']
            | RootStackParamList['OpenedIdeaScreen']
    ) => {
        setIdeaOptions(false);
        if (screen === 'ReportIdeaScreen') navigation.pop();
        navigation.navigate(screen, params);
    };

    async function handleCreateTracking() {
        const id_tracking = await createTracking(ideaId, uid);
        if (id_tracking) {
            const messagesUpdated = messages.map(msg => {
                if (msg.id === ideaId) {
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
        const isDeleted = await deleteTracking(ideaId);
        if (isDeleted) {
            let messagesUpdated: Message[];
            if (filter === '/tracking') {
                messagesUpdated = messages.filter(msg => msg.id !== ideaId);
            } else {
                messagesUpdated = messages.map(msg => {
                    if (msg.id === ideaId) {
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
    async function handleIdeaRemoveFromFeed() {
        setIdeaOptions(false);
        await createReportIdea(ideaId, '', uid, true);
        dispatch(
            setModalAlert({ isOpen: true, text: 'Ya no verás este contenido', icon: faThumbsDown })
        );
        const messagesUpdated = messages.filter(msg => msg.id !== ideaId);
        dispatch(setMessages(messagesUpdated));
        if (isOpenedIdeaScreen) navigation.goBack();
    }

    const handleDelete = () => {
        deleteIdea(ideaId);
        const messagesUpdated = messages.filter(msg => msg.id !== ideaId);
        dispatch(setMessages(messagesUpdated));
        dispatch(setModalAlert({ isOpen: true, text: 'Idea eliminada', icon: faEraser }));
        setIdeaOptions(false);
        if (isOpenedIdeaScreen) navigation.goBack();
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
                                    {ideaType !== IdeaType.X2 && (
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
                                            {!message.anonymous && (
                                                <TouchableOpacity
                                                    style={stylescomp.button}
                                                    onPress={() =>
                                                        goToScreen('ReplyIdeaScreen', {
                                                            message: {
                                                                ideaId: message.ideaId,
                                                                message: message.message,
                                                                user: message.user,
                                                                date: message.date,
                                                            },
                                                        })
                                                    }
                                                >
                                                    <FontAwesomeIcon
                                                        icon={faReply}
                                                        color="#01192E"
                                                        size={13}
                                                    />
                                                    <Text style={stylescomp.text}>
                                                        Replicar en priv
                                                    </Text>
                                                </TouchableOpacity>
                                            )}
                                        </>
                                    )}

                                    <TouchableOpacity
                                        style={stylescomp.button}
                                        onPress={handleIdeaRemoveFromFeed}
                                    >
                                        <FontAwesomeIcon
                                            icon={faThumbsDown}
                                            color="#01192E"
                                            size={12}
                                        />
                                        <Text style={stylescomp.text}>No me gusta</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={stylescomp.button}
                                        onPress={() =>
                                            goToScreen('ReportIdeaScreen', {
                                                ideaId: message.ideaId,
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
                            {!isOpenedIdeaScreen && ideaType === IdeaType.X2 && (
                                <TouchableOpacity
                                    style={stylescomp.button}
                                    onPress={() =>
                                        goToScreen('OpenedIdeaScreen', {
                                            ideaId: message.ideaId,
                                            filter: filter,
                                        })
                                    }
                                >
                                    <FontAwesomeIcon icon={faTrashCan} color="#01192E" size={13} />
                                    <Text style={stylescomp.text}>Ver idea original</Text>
                                </TouchableOpacity>
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
