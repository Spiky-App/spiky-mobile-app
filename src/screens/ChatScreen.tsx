import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState, useRef, useContext } from 'react';
import {
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
import { ChatMessage as ChatMessageProp, User } from '../types/store';
import { faChevronLeft } from '../constants/icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SocketContext from '../context/Socket/Context';
import { ChatMessage } from '../components/ChatMessage';
import { updateLastChatMsgConversation } from '../store/feature/chats/chatsSlice';

const DEFAULT_FORM: FormChat = {
    message: '',
};

type Props = DrawerScreenProps<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = ({ route }: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const dispatch = useAppDispatch();
    const { top, bottom } = useSafeAreaInsets();
    const refFlatList = useRef<FlatList>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [moreChatMsg, setMoreChatMsg] = useState(true);
    const [chatMessages, setChatMessages] = useState<ChatMessageProp[]>([]);
    const { form, onChange } = useForm<FormChat>(DEFAULT_FORM);
    const { getChatMessages, createChatMessageSeen } = useSpikyService();
    const navigation = useNavigation<any>();
    const { SocketState } = useContext(SocketContext);
    const conversationId = route.params?.conversationId;
    const [toUser, setToUser] = useState<User>(route.params?.toUser);

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

    async function backToConnectionsScreen() {
        dispatch(updateLastChatMsgConversation(chatMessages[0]));
        navigation.goBack();
    }

    function updateChatMessages(chatMessage: ChatMessageProp) {
        if (chatMessages) {
            setChatMessages(v => [chatMessage, ...v]);
            if (chatMessage.userId !== uid) createChatMessageSeen(chatMessage.id);
        }
    }

    useEffect(() => {
        SocketState.socket?.on('userOnline', resp => {
            const { converId } = resp;
            if (converId === conversationId) setToUser({ ...toUser, online: true });
        });
        SocketState.socket?.on('userOffline', resp => {
            const { converId } = resp;
            if (converId === conversationId) setToUser({ ...toUser, online: false });
        });
        SocketState.socket?.on('newChatMsg', resp => {
            const { chatmsg, converId } = resp;
            if (converId === conversationId) {
                updateChatMessages(chatmsg);
            }
        });
    }, [SocketState.socket]);

    useEffect(() => {
        if (conversationId) {
            loadChatMessages();
        }
    }, [conversationId]);

    return (
        <BackgroundPaper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    width: '100%',
                    alignItems: 'center',
                    paddingHorizontal: 15,
                    paddingTop: top ? 0 : 15,
                    paddingBottom: bottom ? 0 : 15,
                    flex: 1,
                }}
            >
                <View style={stylescomp.containerHeader}>
                    <TouchableOpacity
                        style={{
                            ...styles.center,
                            marginRight: 5,
                            marginLeft: 10,
                        }}
                        onPress={backToConnectionsScreen}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} color={'white'} size={18} />
                    </TouchableOpacity>
                    <Text style={{ ...styles.text, ...styles.h3, color: '#ffff' }}>
                        {'@' + toUser.nickname + ' de ' + toUser.university.shortname}
                    </Text>
                    <View
                        style={{
                            ...stylescomp.online,
                            backgroundColor: toUser.online ? '#FC702A' : '#bebebe',
                        }}
                    />
                </View>
                <FlatList
                    ref={refFlatList}
                    style={stylescomp.wrap}
                    data={chatMessages}
                    renderItem={({ item }) => <ChatMessage uid={uid} msg={item} />}
                    keyExtractor={item => item.id + ''}
                    showsVerticalScrollIndicator={false}
                    inverted
                    onEndReached={loadMoreChatMsg}
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
            </KeyboardAvoidingView>
        </BackgroundPaper>
    );
};

const stylescomp = StyleSheet.create({
    containerHeader: {
        backgroundColor: '#01192E',
        height: 45,
        borderRadius: 5,
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
    },
});
