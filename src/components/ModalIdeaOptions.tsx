import {
    faEraser,
    faLightbulb,
    faReply,
    faThumbtack,
    faTrashCan,
    faThumbsDown,
    faBan,
} from '../constants/icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useEffect, useState } from 'react';
import {
    Modal,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Animated,
    Text,
    Pressable,
} from 'react-native';
import { useAnimation } from '../hooks/useAnimation';
import { styles } from '../themes/appTheme';
import { IdeaType, Message, User } from '../types/store';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigator/Navigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { faThumbTack } from '@fortawesome/free-solid-svg-icons';
import useSpikyService from '../hooks/useSpikyService';
import ReactionButton from './common/ReactionButton';
import EmojisKeyboard from './EmojisKeyboard';

interface Props {
    setModalIdeaOptions: (value: boolean) => void;
    modalIdeaOptions: boolean;
    myIdea: boolean;
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
    enableX2Reaction: boolean;
    enableEmojiReaction: boolean;
    handleCreateEmojiReaction?: (emoji: string) => void;
    handleCreateX2Reaction?: () => void;
}

export const ModalIdeaOptions = ({
    setModalIdeaOptions,
    modalIdeaOptions,
    myIdea,
    message,
    setMessageTrackingId,
    filter,
    isOpenedIdeaScreen,
    ideaType,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
    enableX2Reaction,
    enableEmojiReaction,
}: Props) => {
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const [emojiKerboard, setEmojiKerboard] = useState(false);
    const uid = useAppSelector((state: RootState) => state.user.id);
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const { deleteIdea, createReportIdea, createTracking, deleteTracking } = useSpikyService();
    const { movingPosition, position } = useAnimation({
        init_position: 0,
    });
    const { ideaId, messageTrackingId } = message;

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
        setModalIdeaOptions(false);
    }

    async function handleIdeaRemoveFromFeed() {
        setModalIdeaOptions(false);
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
        setModalIdeaOptions(false);
        if (isOpenedIdeaScreen) navigation.goBack();
    };

    function goToScreen(
        screen: 'ReplyIdeaScreen' | 'ReportIdeaScreen' | 'OpenedIdeaScreen',
        params?:
            | RootStackParamList['ReplyIdeaScreen']
            | RootStackParamList['ReportIdeaScreen']
            | RootStackParamList['OpenedIdeaScreen']
    ) {
        setModalIdeaOptions(false);
        if (screen === 'ReportIdeaScreen') navigation.pop();
        navigation.navigate(screen, params);
    }

    function handleCloseModal() {
        movingPosition(0, 750, 400, () => setModalIdeaOptions(false));
    }

    useEffect(() => {
        if (modalIdeaOptions) {
            movingPosition(750, 0, 700);
        }
    }, [modalIdeaOptions]);

    return (
        <Modal animationType="fade" visible={modalIdeaOptions} transparent={true}>
            <TouchableWithoutFeedback onPressOut={handleCloseModal}>
                <View style={styles.backmodal}>
                    <TouchableWithoutFeedback>
                        <Animated.View
                            style={{
                                ...stylescom.container,
                                transform: [{ translateY: position }],
                            }}
                        >
                            {!myIdea ? (
                                <>
                                    {ideaType !== IdeaType.X2 && (
                                        <>
                                            {(enableEmojiReaction || enableX2Reaction) && (
                                                <View style={stylescom.optionEmojis}>
                                                    <ReactionButton
                                                        handleCreateEmojiReaction={
                                                            handleCreateEmojiReaction
                                                                ? handleCreateEmojiReaction
                                                                : () => {}
                                                        }
                                                        handleCreateX2Reaction={
                                                            handleCreateX2Reaction
                                                                ? handleCreateX2Reaction
                                                                : () => {}
                                                        }
                                                        enableX2Reaction={enableX2Reaction}
                                                        enableEmojiReaction={enableEmojiReaction}
                                                        setEmojiKerboard={setEmojiKerboard}
                                                        setModalOptions={setModalIdeaOptions}
                                                    />
                                                </View>
                                            )}
                                            <Pressable
                                                style={stylescom.option}
                                                onPress={handleTracking}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faThumbTack}
                                                    color="#01192E"
                                                    size={16}
                                                    style={{ marginRight: 10 }}
                                                />
                                                <Text style={styles.h4}>Tracking</Text>
                                            </Pressable>
                                            {!message.anonymous && (
                                                <Pressable
                                                    style={stylescom.option}
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
                                                        size={16}
                                                        style={{ marginRight: 10 }}
                                                    />
                                                    <Text style={styles.h4}>
                                                        Replicar en privado
                                                    </Text>
                                                </Pressable>
                                            )}
                                        </>
                                    )}
                                    <Pressable
                                        style={stylescom.option}
                                        onPress={handleIdeaRemoveFromFeed}
                                    >
                                        <FontAwesomeIcon
                                            icon={faThumbsDown}
                                            color="#01192E"
                                            size={16}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text style={styles.h4}>No me gusta</Text>
                                    </Pressable>
                                    <Pressable
                                        style={stylescom.option}
                                        onPress={() =>
                                            goToScreen('ReportIdeaScreen', {
                                                ideaId: message.ideaId,
                                            })
                                        }
                                    >
                                        <FontAwesomeIcon
                                            icon={faBan}
                                            color="#01192E"
                                            size={16}
                                            style={{ marginRight: 10 }}
                                        />
                                        <Text style={styles.h4}>Reportar</Text>
                                    </Pressable>
                                </>
                            ) : (
                                <Pressable style={stylescom.option} onPress={handleDelete}>
                                    <FontAwesomeIcon
                                        icon={faTrashCan}
                                        color="#01192E"
                                        size={16}
                                        style={{ marginRight: 10 }}
                                    />
                                    <Text style={styles.h4}>Eliminar</Text>
                                </Pressable>
                            )}
                            {!isOpenedIdeaScreen && ideaType === IdeaType.X2 && (
                                <Pressable
                                    style={stylescom.option}
                                    onPress={() =>
                                        goToScreen('OpenedIdeaScreen', {
                                            ideaId: message.ideaId,
                                            filter: filter,
                                        })
                                    }
                                >
                                    <FontAwesomeIcon
                                        icon={faLightbulb}
                                        color="#01192E"
                                        size={16}
                                        style={{ marginRight: 10 }}
                                    />
                                    <Text style={styles.h4}>Ver idea original</Text>
                                </Pressable>
                            )}
                        </Animated.View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
            {enableEmojiReaction && (
                <EmojisKeyboard
                    isOpend={emojiKerboard}
                    setEmojiKerboard={setEmojiKerboard}
                    afterSelection={
                        handleCreateEmojiReaction ? handleCreateEmojiReaction : () => {}
                    }
                    setModalIdeaOptions={setModalIdeaOptions}
                />
            )}
        </Modal>
    );
};

const stylescom = StyleSheet.create({
    container: {
        height: '42%',
        width: '100%',
        backgroundColor: '#ffff',
        paddingHorizontal: 25,
        paddingVertical: 20,
        position: 'absolute',
        bottom: 0,
        flex: 1,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
    },
    option: {
        ...styles.flex_start,
        backgroundColor: styles.button_container.backgroundColor,
        borderRadius: 12,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        width: '100%',
    },
    optionEmojis: {
        ...styles.flex_start,
        backgroundColor: styles.button_container.backgroundColor,
        borderRadius: 12,
        paddingVertical: 5,
        paddingHorizontal: 15,
        marginBottom: 20,
        width: '100%',
    },
});
