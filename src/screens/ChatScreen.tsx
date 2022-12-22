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
    updateLastChatMsgConversation,
} from '../store/feature/chats/chatsSlice';
import UniversityTag from '../components/common/UniversityTag';
import { useAnimation } from '../hooks/useAnimation';
import SendNudgeButton from '../components/SendNudgeButton';
import { updateNewChatMessagesNumber } from '../store/feature/user/userSlice';
import { generateChatMsgFromChatMensaje } from '../helpers/conversations';
import { MessageRequestData } from '../services/models/spikyService';

const DEFAULT_FORM: FormChat = {
    message: '',
};

type Props = DrawerScreenProps<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = ({ route }: Props) => {
    const user = useAppSelector((state: RootState) => state.user);
    const appState = useAppSelector((state: RootState) => state.ui.appState);
    const dispatch = useAppDispatch();
    const { bottom } = useSafeAreaInsets();
    const refFlatList = useRef<FlatList>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [toUserIsTyping, setToUserIsTyping] = useState(false);
    const timeoutRef = useRef<null | number>(null);
    const [moreChatMsg, setMoreChatMsg] = useState(true);
    const [chatMessages, setChatMessages] = useState<ChatMessageProp[]>([]);
    const { form, onChange } = useForm<FormChat>(DEFAULT_FORM);
    const { getChatMessages, createChatMessageSeen } = useSpikyService();
    const navigation = useNavigation<any>();
    const { socket } = useContext(SocketContext);
    const [conversationId, setConversationId] = useState<number>(0);
    const [toUser, setToUser] = useState<User>(route.params?.toUser);
    const [messageToReply, setMessageToReply] = useState<ChatMessageToReply | null>(null);
    const { fadeOut: fadeOut_Typing } = useAnimation({ init_opacity: 0 });

    async function loadChatMessages(loadMore?: boolean) {
        setIsLoading(true);
        setMoreChatMsg(false);
        const lastChatMessageId = loadMore ? chatMessages[chatMessages.length - 1].id : undefined;
        const chatMessagesResponse = await getChatMessages(conversationId, lastChatMessageId);
        if (chatMessagesResponse) {
            const { chatmensajes, n_chatmensajes_unseens } = chatMessagesResponse;
            const newChatMessages: ChatMessageI[] = chatmensajes.map(chatmsg =>
                generateChatMsgFromChatMensaje(chatmsg, user.id)
            );
            dispatch(
                updateNewChatMessagesNumber(user.newChatMessagesNumber - n_chatmensajes_unseens)
            );
            if (newChatMessages.length === 20) setMoreChatMsg(true);
            setChatMessages(loadMore ? [...chatMessages, ...newChatMessages] : newChatMessages);
            setIsLoading(false);
            dispatch(openNewMsgConversation(conversationId));
        }
    }

    async function updateLastChatMessages() {
        setMoreChatMsg(false);
        const chatMessagesResponse = await getChatMessages(conversationId);
        if (chatMessagesResponse) {
            const { chatmensajes, n_chatmensajes_unseens } = chatMessagesResponse;
            const newChatMessages: ChatMessageI[] = chatmensajes.map(chatmsg =>
                generateChatMsgFromChatMensaje(chatmsg, user.id)
            );
            dispatch(
                updateNewChatMessagesNumber(user.newChatMessagesNumber - n_chatmensajes_unseens)
            );
            if (newChatMessages.length === 20) setMoreChatMsg(true);
            setChatMessages(newChatMessages);
            dispatch(openNewMsgConversation(conversationId));
        }
    }

    function loadMoreChatMsg() {
        if (moreChatMsg) loadChatMessages(true);
    }

    function updateChatMessages(chatMessage: ChatMessageProp) {
        if (chatMessage) {
            setChatMessages(v => [chatMessage, ...v]);
            dispatch(updateLastChatMsgConversation({ chatMsg: chatMessage, newMsg: false }));
            if (chatMessage.userId !== user.id) createChatMessageSeen(chatMessage.id);
        }
    }

    function handleGoBack() {
        navigation.pop();
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
            setConversationId(route.params?.conversationId);
            return () => {
                setConversationId(0);
                socket?.removeListener('userOnline');
                socket?.removeListener('userOffline');
                socket?.removeListener('newChatMsg');
                socket?.removeListener('newChatMsg');
                dispatch(resetActiveConversationId());
            };
        }, [route.params?.conversationId])
    );

    useEffect(() => {
        socket?.on('userOnline', (resp: { converId: number }) => {
            const { converId } = resp;
            if (converId === conversationId) setToUser({ ...toUser, online: true });
        });

        socket?.on('userOffline', (resp: { converId: number }) => {
            const { converId } = resp;
            if (converId === conversationId) setToUser({ ...toUser, online: false });
        });

        socket?.on('newChatMsg', resp => {
            setToUserIsTyping(false);
            const { chatmsg } = resp;
            if (chatmsg.conversationId === conversationId) {
                handleStopTyping();
                updateChatMessages(chatmsg);
            }
        });

        socket?.on('newChatMsgWithReply', (resp: { conver: Conversation; newConver: boolean }) => {
            const { conver } = resp;
            if (conver.id === conversationId) {
                handleStopTyping();
                updateChatMessages({ ...conver.chatmessage });
            }
        });
    }, [socket, conversationId]);

    useEffect(() => {
        socket?.removeListener('isTyping');
        socket?.on('isTyping', resp => {
            const { converId } = resp;
            if (converId === conversationId) {
                if (!toUserIsTyping && !timeoutRef.current) {
                    setToUserIsTyping(true);
                    timeoutRef.current = setTimeout(() => {
                        fadeOut_Typing(200, () => setToUserIsTyping(false));
                        timeoutRef.current = null;
                    }, 4000);
                }
            }
        });
    }, [socket, conversationId, toUserIsTyping]);

    useEffect(() => {
        if (conversationId && appState === 'active') {
            if (chatMessages?.length === 0) {
                loadChatMessages();
            } else {
                updateLastChatMessages();
            }
        }
    }, [conversationId, appState]);

    return (
        <BackgroundPaper topDark>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                            onPress={handleGoBack}
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
                                {'@' + toUser.nickname}
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
                        conversationId={conversationId}
                        toUser={toUser.id}
                        isOnline={toUser.online}
                    />
                </View>
                <View
                    style={{
                        width: '100%',
                        alignItems: 'center',
                        paddingHorizontal: 15,
                        flex: 1,
                    }}
                >
                    <FlatList
                        ref={refFlatList}
                        style={stylescomp.wrap}
                        data={chatMessages}
                        renderItem={({ item }) => (
                            <ChatMessage
                                msg={item}
                                user={item.userId === user.id ? user : toUser}
                                setMessageToReply={setMessageToReply}
                            />
                        )}
                        keyExtractor={item => item.id + ''}
                        showsVerticalScrollIndicator={false}
                        inverted
                        onEndReached={loadMoreChatMsg}
                        ListHeaderComponent={<TypingBubble toUserIsTyping={toUserIsTyping} />}
                        ListFooterComponent={isLoading ? LoadingAnimated : <></>}
                        ListFooterComponentStyle={{ marginVertical: 12 }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'flex-end',
                        }}
                        keyboardShouldPersistTaps={'handled'}
                    />

                    <InputChat
                        form={form}
                        onChange={onChange}
                        updateChatMessages={updateChatMessages}
                        conversationId={conversationId}
                        refFlatList={refFlatList}
                        toUser={toUser}
                        HideKeyboardAfterSumbit
                        messageToReply={messageToReply}
                        setMessageToReply={setMessageToReply}
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

    // if (!toUserIsTyping) {
    //     return <></>;
    // }

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
        // alignItems: 'center',
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
