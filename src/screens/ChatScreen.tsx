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
import { ChatMessage as ChatMessageProp, User, Conversation } from '../types/store';
import { faChevronLeft } from '../constants/icons/FontAwesome';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SocketContext from '../context/Socket/Context';
import { ChatMessage } from '../components/ChatMessage';
import { updateLastChatMsgConversation } from '../store/feature/chats/chatsSlice';
import UniversityTag from '../components/common/UniversityTag';
import { useAnimation } from '../hooks/useAnimation';

const DEFAULT_FORM: FormChat = {
    message: '',
};

type Props = DrawerScreenProps<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = ({ route }: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
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
    const {
        opacity: opacity_Typing,
        fadeIn: fadeIn_Typing,
        fadeOut: fadeOut_Typing,
    } = useAnimation({ init_opacity: 0 });

    async function loadChatMessages(loadMore?: boolean) {
        setIsLoading(true);
        setMoreChatMsg(false);
        const lastChatMessageId = loadMore ? chatMessages[chatMessages.length - 1].id : undefined;
        const newChatMessages = await getChatMessages(conversationId, lastChatMessageId);
        if (newChatMessages.length === 20) setMoreChatMsg(true);
        setChatMessages([...chatMessages, ...newChatMessages]);
        setIsLoading(false);
    }

    function loadMoreChatMsg() {
        if (moreChatMsg) loadChatMessages(true);
    }

    function updateChatMessages(chatMessage: ChatMessageProp) {
        if (chatMessages) {
            setChatMessages(v => [chatMessage, ...v]);
            dispatch(updateLastChatMsgConversation({ chatMsg: chatMessage, newMsg: false }));
            if (chatMessage.userId !== uid) createChatMessageSeen(chatMessage.id);
        }
    }

    function handleGoBack() {
        navigation.pop();
    }

    function handleStopTyping() {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            setToUserIsTyping(false);
        }
    }

    useFocusEffect(
        useCallback(() => {
            setConversationId(route.params?.conversationId);
            return () => {
                setConversationId(0);
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
        socket?.on('isTyping', resp => {
            const { converId } = resp;
            if (converId === conversationId) {
                if (!toUserIsTyping && timeoutRef.current) {
                    setToUserIsTyping(true);
                    timeoutRef.current = setTimeout(
                        () => fadeOut_Typing(200, () => setToUserIsTyping(false)),
                        3000
                    );
                }
            }
        });
    }, [socket, conversationId, toUserIsTyping]);

    useEffect(() => {
        if (conversationId) {
            loadChatMessages();
        }
    }, [conversationId]);

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
                <View
                    style={{
                        ...stylescomp.containerHeader,
                    }}
                >
                    <TouchableOpacity
                        style={{
                            ...styles.center,
                            marginRight: 10,
                            marginLeft: 20,
                        }}
                        onPress={handleGoBack}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} color={'white'} size={18} />
                    </TouchableOpacity>
                    <Text style={{ ...styles.text, ...styles.h3, color: '#ffff', marginRight: 5 }}>
                        {'@' + toUser.nickname}
                    </Text>
                    <UniversityTag id={toUser.universityId} fontSize={23} />
                    <View
                        style={{
                            ...stylescomp.online,
                            backgroundColor: toUser.online ? '#FC702A' : '#bebebe',
                        }}
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
                        renderItem={({ item }) => <ChatMessage uid={uid} msg={item} />}
                        keyExtractor={item => item.id + ''}
                        showsVerticalScrollIndicator={false}
                        inverted
                        onEndReached={loadMoreChatMsg}
                        ListHeaderComponent={
                            <TypingBubble
                                opacity={opacity_Typing}
                                fadeIn={fadeIn_Typing}
                                toUserIsTyping={toUserIsTyping}
                            />
                        }
                        ListFooterComponent={isLoading ? LoadingAnimated : <></>}
                        ListFooterComponentStyle={{ marginVertical: 12 }}
                        contentContainerStyle={{
                            flexGrow: 1,
                            justifyContent: 'flex-end',
                        }}
                    />
                    <InputChat
                        form={form}
                        onChange={onChange}
                        updateChatMessages={updateChatMessages}
                        conversationId={conversationId}
                        refFlatList={refFlatList}
                        toUser={toUser}
                        HideKeyboardAfterSumbit
                    />
                </View>
            </KeyboardAvoidingView>
        </BackgroundPaper>
    );
};

interface TypingBubbleProps {
    toUserIsTyping: boolean;
    opacity: Animated.Value;
    fadeIn: (duration?: number, callback?: () => void, delay?: number) => void;
}

const TypingBubble = ({ toUserIsTyping, opacity, fadeIn }: TypingBubbleProps) => {
    useEffect(() => {
        if (toUserIsTyping) {
            fadeIn(300);
        }
    }, [toUserIsTyping]);

    if (!toUserIsTyping) {
        return <></>;
    }

    return (
        <Animated.View style={{ ...stylescomp.writting, opacity }}>
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
        height: 30,
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
