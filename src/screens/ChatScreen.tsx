import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React, { useEffect, useState, useRef } from 'react';
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
import { ChatMessage } from '../types/store';
import { faChevronLeft } from '../constants/icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { getTime } from '../helpers/getTime';
import { transformMsg } from '../helpers/transformMsg';

const DEFAULT_FORM: FormChat = {
    message: '',
};

type Props = DrawerScreenProps<RootStackParamList, 'ChatScreen'>;

export const ChatScreen = ({ route }: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const { top, bottom } = useSafeAreaInsets();
    const refFlatList = useRef<FlatList>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const { form, onChange } = useForm<FormChat>(DEFAULT_FORM);
    const { getChatMessages } = useSpikyService();
    const navigation = useNavigation<any>();
    const conversationId = route.params?.conversationId;
    const toUser = route.params?.toUser;

    async function loadConversation() {
        setIsLoading(true);
        const newChatMessages = await getChatMessages(conversationId);
        setChatMessages(newChatMessages);
        setIsLoading(false);
    }

    const updateChatMessages = (chatMessage: ChatMessage) => {
        if (chatMessages) {
            setChatMessages([chatMessage, ...chatMessages]);
        }
    };

    useEffect(() => {
        if (conversationId) {
            loadConversation();
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
                        onPress={() => navigation.goBack()}
                    >
                        <FontAwesomeIcon icon={faChevronLeft} color={'white'} size={18} />
                    </TouchableOpacity>
                    <Text style={{ ...styles.text, ...styles.h3, color: '#ffff' }}>
                        {'@' + toUser.nickname + ' de ' + toUser.university.shortname}
                    </Text>
                    <View style={stylescomp.online} />
                </View>

                {!isLoading ? (
                    <FlatList
                        ref={refFlatList}
                        style={stylescomp.wrap}
                        data={chatMessages}
                        renderItem={({ item }) => <Message msg={item} uid={uid} />}
                        keyExtractor={item => item.id + ''}
                        showsVerticalScrollIndicator={false}
                        inverted
                        // onEndReached={loadMore}
                        // ListFooterComponent={loading ? LoadingAnimated : <></>}
                        // ListFooterComponentStyle={{ marginVertical: 12 }}
                    />
                ) : (
                    <View style={{ ...styles.center, flex: 1 }}>
                        <LoadingAnimated />
                    </View>
                )}
                <InputChat
                    form={form}
                    onChange={onChange}
                    updateChatMessages={updateChatMessages}
                    conversationId={conversationId}
                    refFlatList={refFlatList}
                />
            </KeyboardAvoidingView>
        </BackgroundPaper>
    );
};

interface MessageProp {
    msg: ChatMessage;
    uid: number;
}

const Message = ({ msg, uid }: MessageProp) => {
    const owner = msg.userId === uid;
    const time = getTime(msg.date.toString());
    const replyMessage = transformMsg(msg.replyMessage?.message || '');

    return (
        <View style={owner ? stylescomp.containerMessageRight : stylescomp.containerMessageLeft}>
            <View>
                {msg.replyMessage && (
                    <View style={stylescomp.containerReplyMsg}>
                        <View style={{ flexDirection: 'row', marginBottom: 3 }}>
                            <Text style={{ ...styles.textbold, fontSize: 12 }}>
                                @{msg.replyMessage.user.nickname}
                            </Text>
                            <Text style={{ ...styles.text, fontSize: 12 }}> de </Text>
                            <Text style={{ ...styles.text, fontSize: 12 }}>
                                {msg.replyMessage.user.university.shortname}
                            </Text>
                        </View>
                        <Text style={{ ...styles.text, fontSize: 12 }}>
                            {replyMessage.length > 73
                                ? replyMessage.substring(0, 73) + '...'
                                : replyMessage}
                        </Text>
                    </View>
                )}
                <View
                    style={{
                        ...stylescomp.message,
                        justifyContent: owner ? 'flex-end' : 'flex-start',
                    }}
                >
                    <Text style={stylescomp.text}>{msg.message}</Text>
                    <Text style={stylescomp.time}>{time}</Text>
                </View>
            </View>
        </View>
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
    containerMessageRight: {
        marginVertical: 8,
        alignItems: 'flex-end',
    },
    containerMessageLeft: {
        marginVertical: 8,
        alignItems: 'flex-start',
    },
    message: {
        ...styles.shadow,
        maxWidth: 280,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        backgroundColor: 'white',
        flexWrap: 'wrap',
    },
    text: {
        ...styles.text,
        fontSize: 14,
    },
    time: {
        ...styles.textGray,
        textAlign: 'right',
        paddingLeft: 5,
        marginTop: 2,
    },
    containerReplyMsg: {
        backgroundColor: '#e8e6e6',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        maxWidth: 280,
    },
});
