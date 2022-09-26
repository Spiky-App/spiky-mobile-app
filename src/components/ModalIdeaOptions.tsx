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
import { User } from '../types/store';
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

    async function handleTracking() {
        if (!messageTrackingId) {
            const id_tracking = await createTracking(messageId);
            if (setMessageTrackingId) setMessageTrackingId(id_tracking);
        } else {
            await deleteTracking(messageId, filter);
            if (setMessageTrackingId) setMessageTrackingId(undefined);
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
