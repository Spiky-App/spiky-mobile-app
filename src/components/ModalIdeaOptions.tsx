import {
    faEraser,
    faLightbulb,
    faReply,
    faThumbtack,
    faTrashCan,
    faThumbsDown,
    faBan,
    faPenFancy,
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
        id: number;
        message: string;
        user: User;
        date: number;
        messageTrackingId?: number;
        anonymous: boolean;
        type: IdeaType;
    };
    setMessageTrackingId?: (value: number | undefined) => void;
    filter?: string;
    isOpenedIdeaScreen?: boolean;
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
    const { deleteIdea, createReport, createTracking, deleteTracking } = useSpikyService();
    const { movingPosition, position } = useAnimation({
        init_position: 0,
    });
    const { id: ideaId, messageTrackingId } = message;

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
        await createReport('', ideaId, message.user.nickname, true);
        dispatch(
            setModalAlert({ isOpen: true, text: 'Ya no verás este contenido', icon: faThumbsDown })
        );
        const messagesUpdated = messages.filter(msg => msg.id !== ideaId);
        dispatch(setMessages(messagesUpdated));
        if (isOpenedIdeaScreen) navigation.goBack();
    }

    function handleDelete() {
        deleteIdea(ideaId);
        const messagesUpdated = messages.filter(msg => msg.id !== ideaId);
        dispatch(setMessages(messagesUpdated));
        dispatch(setModalAlert({ isOpen: true, text: 'Idea eliminada', icon: faEraser }));
        setModalIdeaOptions(false);
        if (isOpenedIdeaScreen) navigation.goBack();
    }

    function goToScreen(
        screen: 'ReplyIdeaScreen' | 'ReportIdeaScreen' | 'OpenedIdeaScreen' | 'CreateQuoteScreen',
        params?:
            | RootStackParamList['ReplyIdeaScreen']
            | RootStackParamList['ReportIdeaScreen']
            | RootStackParamList['OpenedIdeaScreen']
            | RootStackParamList['CreateQuoteScreen']
    ) {
        setModalIdeaOptions(false);
        if (screen === 'ReportIdeaScreen') navigation.pop();
        navigation.navigate(screen, params);
    }

    function handleCloseModal() {
        movingPosition(0, 950, 400, () => setModalIdeaOptions(false));
    }

    useEffect(() => {
        if (modalIdeaOptions) {
            movingPosition(950, 0, 700);
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
                                    {message.type !== IdeaType.X2 && (
                                        <>
                                            {(enableEmojiReaction || enableX2Reaction) && (
                                                <Reactions
                                                    handleCreateEmojiReaction={
                                                        handleCreateEmojiReaction
                                                    }
                                                    handleCreateX2Reaction={handleCreateX2Reaction}
                                                    enableX2Reaction={enableX2Reaction}
                                                    enableEmojiReaction={enableEmojiReaction}
                                                    setEmojiKerboard={setEmojiKerboard}
                                                    setModalOptions={setModalIdeaOptions}
                                                />
                                            )}
                                            {!message.anonymous && (
                                                <ReplyIdeagOption
                                                    goToScreen={goToScreen}
                                                    message={message}
                                                />
                                            )}
                                            <QuoteOption
                                                goToScreen={goToScreen}
                                                message={message}
                                            />
                                            <TrackingOption handleTracking={handleTracking} />
                                        </>
                                    )}
                                    <NoLikeOption
                                        handleIdeaRemoveFromFeed={handleIdeaRemoveFromFeed}
                                    />
                                    <ReportIdeaOption goToScreen={goToScreen} message={message} />
                                </>
                            ) : (
                                <>
                                    <QuoteOption goToScreen={goToScreen} message={message} />
                                    <DeleteOption handleDelete={handleDelete} />
                                </>
                            )}
                            {!isOpenedIdeaScreen && message.type === IdeaType.X2 && (
                                <SeeOriginalIdeaOption
                                    goToScreen={goToScreen}
                                    message={message}
                                    filter={filter}
                                />
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

interface DeleteOptionProps {
    handleDelete: () => void;
}
const DeleteOption = ({ handleDelete }: DeleteOptionProps) => (
    <Pressable style={stylescom.option} onPress={handleDelete}>
        <FontAwesomeIcon icon={faTrashCan} color="#01192E" size={16} style={{ marginRight: 10 }} />
        <Text style={styles.h4}>Eliminar</Text>
    </Pressable>
);

interface TrackingOptionProps {
    handleTracking: () => void;
}
const TrackingOption = ({ handleTracking }: TrackingOptionProps) => (
    <Pressable style={stylescom.option} onPress={handleTracking}>
        <FontAwesomeIcon icon={faThumbTack} color="#01192E" size={16} style={{ marginRight: 10 }} />
        <Text style={styles.h4}>Tracking</Text>
    </Pressable>
);

interface NoLikeOptionProps {
    handleIdeaRemoveFromFeed: () => void;
}
const NoLikeOption = ({ handleIdeaRemoveFromFeed }: NoLikeOptionProps) => (
    <Pressable style={stylescom.option} onPress={handleIdeaRemoveFromFeed}>
        <FontAwesomeIcon
            icon={faThumbsDown}
            color="#01192E"
            size={16}
            style={{ marginRight: 10 }}
        />
        <Text style={styles.h4}>No me gusta</Text>
    </Pressable>
);

interface QuoteOptionProps {
    goToScreen: (
        screen: 'CreateQuoteScreen',
        params?: RootStackParamList['CreateQuoteScreen']
    ) => void;
    message: {
        id: number;
        message: string;
        user: User;
        date: number;
        anonymous: boolean;
        type: IdeaType;
    };
}
const QuoteOption = ({ goToScreen, message }: QuoteOptionProps) => (
    <Pressable
        style={stylescom.option}
        onPress={() =>
            goToScreen('CreateQuoteScreen', {
                idea: message,
            })
        }
    >
        <FontAwesomeIcon icon={faPenFancy} color="#01192E" size={16} style={{ marginRight: 10 }} />
        <Text style={styles.h4}>Citar idea</Text>
    </Pressable>
);

interface SeeOriginalIdeaOptionProps {
    goToScreen: (
        screen: 'OpenedIdeaScreen',
        params?: RootStackParamList['OpenedIdeaScreen']
    ) => void;
    message: {
        id: number;
    };
    filter?: string;
}
const SeeOriginalIdeaOption = ({ goToScreen, message, filter }: SeeOriginalIdeaOptionProps) => (
    <Pressable
        style={stylescom.option}
        onPress={() =>
            goToScreen('OpenedIdeaScreen', {
                ideaId: message.id,
                filter: filter,
            })
        }
    >
        <FontAwesomeIcon icon={faLightbulb} color="#01192E" size={16} style={{ marginRight: 10 }} />
        <Text style={styles.h4}>Ver idea original</Text>
    </Pressable>
);

interface ReportIdeaOptionProps {
    goToScreen: (
        screen: 'ReportIdeaScreen',
        params?: RootStackParamList['ReportIdeaScreen']
    ) => void;
    message: {
        id: number;
    };
}
const ReportIdeaOption = ({ goToScreen, message }: ReportIdeaOptionProps) => (
    <Pressable
        style={stylescom.option}
        onPress={() =>
            goToScreen('ReportIdeaScreen', {
                ideaId: message.id,
            })
        }
    >
        <FontAwesomeIcon icon={faBan} color="#01192E" size={16} style={{ marginRight: 10 }} />
        <Text style={styles.h4}>Reportar</Text>
    </Pressable>
);

interface ReplyIdeaOptionProps {
    goToScreen: (screen: 'ReplyIdeaScreen', params?: RootStackParamList['ReplyIdeaScreen']) => void;
    message: {
        id: number;
        message: string;
        user: User;
        date: number;
        messageTrackingId?: number;
        anonymous: boolean;
        type: IdeaType;
    };
}
const ReplyIdeagOption = ({ goToScreen, message }: ReplyIdeaOptionProps) => (
    <Pressable
        style={stylescom.option}
        onPress={() =>
            goToScreen('ReplyIdeaScreen', {
                idea: {
                    id: message.id,
                    message: message.message,
                    user: message.user,
                    date: message.date,
                    type: message.type,
                },
            })
        }
    >
        <FontAwesomeIcon icon={faReply} color="#01192E" size={16} style={{ marginRight: 10 }} />
        <Text style={styles.h4}>Replicar en privado</Text>
    </Pressable>
);

interface ReactionsProps {
    setModalOptions?: (value: boolean) => void;
    handleCreateEmojiReaction?: (emoji: string) => void;
    handleCreateX2Reaction?: () => void;
    enableX2Reaction: boolean;
    enableEmojiReaction: boolean;
    setEmojiKerboard: (value: boolean) => void;
}
const Reactions = ({
    setModalOptions,
    handleCreateEmojiReaction,
    handleCreateX2Reaction,
    enableX2Reaction,
    enableEmojiReaction,
    setEmojiKerboard,
}: ReactionsProps) => (
    <View style={stylescom.optionEmojis}>
        <ReactionButton
            handleCreateEmojiReaction={
                handleCreateEmojiReaction ? handleCreateEmojiReaction : () => {}
            }
            handleCreateX2Reaction={handleCreateX2Reaction ? handleCreateX2Reaction : () => {}}
            enableX2Reaction={enableX2Reaction}
            enableEmojiReaction={enableEmojiReaction}
            setEmojiKerboard={setEmojiKerboard}
            setModalOptions={setModalOptions}
        />
    </View>
);

const stylescom = StyleSheet.create({
    container: {
        height: 'auto',
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
