import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState, useRef, useContext, useCallback } from 'react';
import {
    Animated,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { FormChat, InputChat } from '../components/InputChat';
import { LoadingAnimated } from '../components/svg/LoadingAnimated';
import { useForm } from '../hooks/useForm';
import useSpikyService from '../hooks/useSpikyService';
import { RootStackParamList } from '../navigator/Navigator';
import { styles } from '../themes/appTheme';
import {
    ChatMessage as ChatMessageProp,
    User,
    Conversation,
    ChatMessage as ChatMessageI,
    ChatMessageToReply,
} from '../types/store';
import { faChevronLeft } from '../constants/icons/FontAwesome';
import { CommonActions, useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SocketContext from '../context/Socket/Context';
import { ChatMessage } from '../components/ChatMessage';
import {
    openNewMsgConversation,
    resetActiveConversationId,
    setActiveConversationId,
    updateLastChatMsgConversation,
} from '../store/feature/chats/chatsSlice';
import UniversityTag from '../components/common/UniversityTag';
import { useAnimation } from '../hooks/useAnimation';
import SendNudgeButton from '../components/SendNudgeButton';
import { updateNewChatMessagesNumber } from '../store/feature/user/userSlice';
import { generateChatMsgFromChatMensaje } from '../helpers/conversations';
import { MessageRequestData } from '../services/models/spikyService';
import NetworkErrorFeed from '../components/NetworkErrorFeed';

const DEFAULT_FORM: FormChat = {
    message: '',
};

type Props = DrawerScreenProps<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = ({ route }: Props) => {
    const user = useAppSelector((state: RootState) => state.user);
    const appState = useAppSelector((state: RootState) => state.ui.appState);
    const { updateAuxActiveConversation, activeConversationId } = useAppSelector(
        (state: RootState) => state.chats
    );
    const dispatch = useAppDispatch();
    const { bottom } = useSafeAreaInsets();
    const refFlatList = useRef<FlatList>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [networkError, setNetworkError] = useState(false);
    const [toUserIsTyping, setToUserIsTyping] = useState(false);
    const timeoutRef = useRef<null | number>(null);
    const [moreChatMsg, setMoreChatMsg] = useState(false);
    const [chatMessages, setChatMessages] = useState<ChatMessageProp[]>([]);
    const { form, onChange } = useForm<FormChat>(DEFAULT_FORM);
    const { getChatMessages, createChatMessageSeen } = useSpikyService();
    const navigation = useNavigation<any>();
    const { socket } = useContext(SocketContext);
    const [toUser, setToUser] = useState<User>(route.params?.toUser);
    const [messageToReply, setMessageToReply] = useState<ChatMessageToReply | null>(null);
    const { fadeOut: fadeOut_Typing } = useAnimation({ init_opacity: 0 });

    async function loadChatMessages(loadMore?: boolean) {
        if (networkError) setNetworkError(false);
        setIsLoading(true);
        setMoreChatMsg(false);
        const lastChatMessageId = loadMore ? chatMessages[chatMessages.length - 1].id : undefined;
        const { chatMessagesResponse, networkError: networkErrorReturn } = await getChatMessages(
            activeConversationId,
            route.params?.toUser.id,
            lastChatMessageId
        );
        if (networkErrorReturn) {
            setNetworkError(true);
            setIsLoading(false);
        }
        if (chatMessagesResponse) {
            const { chatmensajes, n_chatmensajes_unseens, toUserIsOnline } = chatMessagesResponse;
            const newChatMessages: ChatMessageI[] = chatmensajes.map(chatmsg =>
                generateChatMsgFromChatMensaje(chatmsg, user.id)
            );
            dispatch(updateNewChatMessagesNumber(-n_chatmensajes_unseens));
            setToUser({ ...route.params?.toUser, online: toUserIsOnline });
            setChatMessages(loadMore ? [...chatMessages, ...newChatMessages] : newChatMessages);
            setIsLoading(false);
            if (newChatMessages.length === 25) setMoreChatMsg(true);
            if (n_chatmensajes_unseens > 0) dispatch(openNewMsgConversation(activeConversationId));
        }
    }

    async function loadFirstChatMessages() {
        if (networkError) setNetworkError(false);
        const firstChatMessageId = chatMessages[0].id;
        const { chatMessagesResponse, networkError: networkErrorReturn } = await getChatMessages(
            activeConversationId,
            route.params?.toUser.id,
            undefined,
            firstChatMessageId
        );
        if (networkErrorReturn) setNetworkError(true);
        if (chatMessagesResponse) {
            const { chatmensajes, n_chatmensajes_unseens, toUserIsOnline } = chatMessagesResponse;
            const newChatMessages: ChatMessageI[] = chatmensajes.map(chatmsg =>
                generateChatMsgFromChatMensaje(chatmsg, user.id)
            );
            dispatch(updateNewChatMessagesNumber(-n_chatmensajes_unseens));
            setToUser({ ...route.params?.toUser, online: toUserIsOnline });
            setChatMessages(v => [...newChatMessages, ...v]);
            if (n_chatmensajes_unseens > 0) dispatch(openNewMsgConversation(activeConversationId));
        }
    }

    function updateChatMessages(chatMessage: ChatMessageProp) {
        if (chatMessage) {
            setChatMessages(v => [chatMessage, ...v]);
            dispatch(updateLastChatMsgConversation({ chatMsg: chatMessage, newMsg: false }));
            if (chatMessage.userId !== user.id) createChatMessageSeen(chatMessage.id);
        }
    }

    function handleStopTyping() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
            setToUserIsTyping(false);
        }
    }

    const changeScreen = (screen: string, params?: MessageRequestData) => {
        navigation.pop();
        const targetRoute = navigation
            .getState()
            .routes.find((route_n: { name: string }) => route_n.name === screen);
        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [
                    {
                        name: screen,
                        params: {
                            ...targetRoute?.params,
                            ...params,
                        },
                    },
                ],
            })
        );
    };

    useFocusEffect(
        useCallback(() => {
            setChatMessages([]);
            dispatch(setActiveConversationId(route.params?.conversationId));
            return () => {
                socket?.removeListener('userOnline');
                socket?.removeListener('userOffline');
                socket?.removeListener('newChatMsg');
                socket?.removeListener('newChatMsgWithReply');
                setChatMessages([]);
                dispatch(resetActiveConversationId());
                setMoreChatMsg(false);
            };
        }, [route.params?.conversationId])
    );

    useEffect(() => {
        socket?.on('userOnline', (resp: { converId: number }) => {
            const { converId } = resp;
            if (converId === activeConversationId) setToUser({ ...toUser, online: true });
        });

        socket?.on('userOffline', (resp: { converId: number }) => {
            const { converId } = resp;
            if (converId === activeConversationId) setToUser({ ...toUser, online: false });
        });

        socket?.on('newChatMsg', resp => {
            setToUserIsTyping(false);
            const { chatmsg } = resp;
            if (chatmsg.conversationId === activeConversationId) {
                handleStopTyping();
                updateChatMessages(chatmsg);
            }
        });

        socket?.on('newChatMsgWithReply', (resp: { conver: Conversation; newConver: boolean }) => {
            const { conver } = resp;
            if (conver.id === activeConversationId) {
                handleStopTyping();
                updateChatMessages({ ...conver.chatmessage });
            }
        });
    }, [socket, activeConversationId, updateAuxActiveConversation]);

    useEffect(() => {
        socket?.removeListener('isTyping');
        socket?.on('isTyping', resp => {
            const { converId } = resp;
            if (converId === activeConversationId) {
                if (!toUserIsTyping && !timeoutRef.current) {
                    setToUserIsTyping(true);
                    timeoutRef.current = setTimeout(() => {
                        fadeOut_Typing(200, () => setToUserIsTyping(false));
                        timeoutRef.current = null;
                    }, 4000);
                }
            }
        });
    }, [socket, activeConversationId, toUserIsTyping]);

    useEffect(() => {
        if (activeConversationId !== 0 && appState === 'active') {
            if (chatMessages?.length === 0) {
                loadChatMessages();
            } else {
                loadFirstChatMessages();
            }
        }
    }, [activeConversationId, appState]);

    return (
        <BackgroundPaper topDark>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingBottom: bottom ? 0 : 15,
                    flex: 1,
                }}
            >
                <View style={stylescomp.containerHeader}>
                    <View style={{ ...styles.center, flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                ...styles.center,
                                paddingRight: 10,
                                paddingLeft: 20,
                                paddingVertical: 10,
                            }}
                            onPress={() => navigation.navigate('ConnectionsScreen')}
                        >
                            <FontAwesomeIcon icon={faChevronLeft} color={'white'} size={18} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() =>
                                changeScreen('ProfileScreen', {
                                    alias: toUser.nickname,
                                })
                            }
                        >
                            <Text style={{ ...styles.h3, color: '#ffff', marginRight: 5 }}>
                                {toUser.nickname}
                            </Text>
                        </TouchableOpacity>
                        <UniversityTag id={toUser.universityId} fontSize={23} />
                        <View
                            style={{
                                ...stylescomp.online,
                                backgroundColor: toUser.online ? '#FC702A' : '#bebebe',
                            }}
                        />
                    </View>
                    <SendNudgeButton
                        conversationId={activeConversationId}
                        toUser={toUser.id}
                        isOnline={toUser.online}
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        flex: 1,
                    }}
                >
                    {!networkError ? (
                        <FlatList
                            ref={refFlatList}
                            style={stylescomp.wrap}
                            data={chatMessages}
                            renderItem={({ item }) => (
                                <ChatMessage
                                    msg={item}
                                    user={item.userId === user.id ? user : toUser}
                                    setMessageToReply={setMessageToReply}
                                    toUser={toUser}
                                />
                            )}
                            keyExtractor={item => item.id + ''}
                            showsVerticalScrollIndicator={false}
                            inverted
                            onEndReached={
                                moreChatMsg && activeConversationId !== 0
                                    ? () => loadChatMessages(true)
                                    : undefined
                            }
                            ListHeaderComponent={
                                toUser.disable ? (
                                    <View style={{ alignItems: 'center', flex: 1, marginTop: 20 }}>
                                        <Text style={styles.textGray}>
                                            {`La cuenta de ${toUser.nickname} está deshabilitada.`}
                                        </Text>
                                    </View>
                                ) : (
                                    <TypingBubble toUserIsTyping={toUserIsTyping} />
                                )
                            }
                            ListFooterComponent={isLoading ? LoadingAnimated : <></>}
                            ListFooterComponentStyle={{ marginVertical: 12 }}
                            contentContainerStyle={{
                                flexGrow: 1,
                                justifyContent: 'flex-end',
                            }}
                            keyboardShouldPersistTaps={'handled'}
                        />
                    ) : (
                        <NetworkErrorFeed callback={loadChatMessages} />
                    )}

                    <InputChat
                        form={form}
                        onChange={onChange}
                        updateChatMessages={updateChatMessages}
                        conversationId={activeConversationId}
                        refFlatList={refFlatList}
                        toUser={toUser}
                        HideKeyboardAfterSumbit
                        messageToReply={messageToReply}
                        setMessageToReply={setMessageToReply}
                        networkError={networkError}
                    />
                </View>
            </KeyboardAvoidingView>
        </BackgroundPaper>
    );
};

interface TypingBubbleProps {
    toUserIsTyping: boolean;
}

const TypingBubble = ({ toUserIsTyping }: TypingBubbleProps) => {
    const height = useRef(new Animated.Value(0)).current;
    const opacity = useRef(new Animated.Value(0)).current;
    const inputRange = [0, 100];
    const outputRange = [0, 100];
    const heightAnimated = height.interpolate({ inputRange, outputRange });

    useEffect(() => {
        if (toUserIsTyping) {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(height, {
                    toValue: 30,
                    duration: 280,
                    useNativeDriver: false,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: false,
                }),
                Animated.timing(height, {
                    toValue: 0,
                    duration: 280,
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [toUserIsTyping]);

    return (
        <Animated.View style={{ ...stylescomp.writting, height: heightAnimated, opacity }}>
            <Text style={{ ...styles.textbold, ...stylescomp.dots }}>...</Text>
        </Animated.View>
    );
};

const stylescomp = StyleSheet.create({
    containerHeader: {
        backgroundColor: '#01192E',
        height: 45,
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
    online: {
        width: 10,
        height: 10,
        backgroundColor: '#FC702A',
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
    },
    wrap: {
        width: '100%',
        marginBottom: 10,
    },
    writting: {
        ...styles.shadow,
        width: 60,
        justifyContent: 'center',
        backgroundColor: 'white',
        marginVertical: 8,
    },
    dots: {
        fontWeight: '600',
        color: '#bebebe',
        fontSize: 35,
        marginLeft: 20,
        position: 'absolute',
        top: -15,
        left: -5,
    },
});
