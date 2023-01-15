import React, { useContext, useEffect, useState, useRef } from 'react';
import {
    Keyboard,
    TextInput,
    View,
    FlatList,
    Text,
    StyleSheet,
    Pressable,
    Animated,
} from 'react-native';
import { faLocationArrow, faXmark } from '../constants/icons/FontAwesome';
import SocketContext from '../context/Socket/Context';
import { generateChatMsgFromChatMensaje } from '../helpers/conversations';
import useSpikyService from '../hooks/useSpikyService';
import { RootState } from '../store';
import { useAppSelector } from '../store/hooks';
import { styles } from '../themes/appTheme';
import { ChatMessage, ChatMessageToReply, User } from '../types/store';
import ButtonIcon from './common/ButtonIcon';
import { selectUserAsObject } from '../store/feature/user/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import UniversityTag from './common/UniversityTag';

export interface FormChat {
    message: string;
}

interface Props {
    conversationId: number;
    form: FormChat;
    updateChatMessages: (chatMessage: ChatMessage) => void;
    onChange: (stateUpdated: Partial<FormChat>) => void;
    refFlatList: React.RefObject<FlatList>;
    toUser: User;
    HideKeyboardAfterSumbit?: boolean;
    messageToReply: ChatMessageToReply | null;
    setMessageToReply: (value: ChatMessageToReply | null) => void;
    networkError: boolean;
}

const MAX_LENGHT = 200;

const DEFAULT_FORM: FormChat = {
    message: '',
};

export const InputChat = ({
    form,
    onChange,
    updateChatMessages,
    conversationId,
    refFlatList,
    toUser,
    HideKeyboardAfterSumbit,
    messageToReply,
    setMessageToReply,
    networkError,
}: Props) => {
    const user = useAppSelector((state: RootState) => state.user);
    const [isDisabled, setDisabled] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const { createChatMessage } = useSpikyService();
    const { socket } = useContext(SocketContext);
    const { message } = form;
    const [counter, setCounter] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const height = useRef(new Animated.Value(0)).current;
    const inputRange = [0, 100];
    const outputRange = [0, 100];
    const heightAnimated = height.interpolate({ inputRange, outputRange });
    const IDEA_MAX_LENGHT = 200;
    const userObj = useAppSelector(selectUserAsObject);

    async function handleCreateChatMessage() {
        const chatmensaje = await createChatMessage(
            conversationId,
            message,
            messageToReply?.messageId
        );
        if (chatmensaje) {
            const newChatMessages = generateChatMsgFromChatMensaje(chatmensaje, user.id);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                setIsTyping(false);
            }
            updateChatMessages(newChatMessages);
            if (userObj) {
                socket?.emit('newChatMsg', {
                    chatmsg: newChatMessages,
                    userto: toUser.id,
                    isOnline: toUser.online,
                    sender: userObj,
                });
            }
        }
    }

    function onPress() {
        setDisabled(true);
        handleCreateChatMessage();
        setMessageToReply(null);
        onChange(DEFAULT_FORM);
        refFlatList.current?.scrollToOffset({ offset: 0 });
        if (!HideKeyboardAfterSumbit) Keyboard.dismiss();
    }

    function handleCancelReply() {
        Animated.timing(height, {
            toValue: 0,
            duration: 50,
            useNativeDriver: false,
        }).start(() => setMessageToReply(null));
    }

    useEffect(() => {
        const messageLength = message.length;
        const counterUpdated = MAX_LENGHT - messageLength;
        setCounter(counterUpdated);
        if (messageLength <= MAX_LENGHT && messageLength > 0) {
            if (isDisabled) setDisabled(false);
        } else setDisabled(true);
        if (!isTyping && toUser.online && message !== '') {
            setIsTyping(true);
            socket?.emit('isTyping', {
                converId: conversationId,
                userto: toUser.id,
            });
            timeoutRef.current = setTimeout(() => setIsTyping(false), 5000);
        }
    }, [message]);

    useEffect(() => {
        const { message: mensaje } = form;
        setCounter(IDEA_MAX_LENGHT - mensaje.length);
    }, [form]);

    useEffect(() => {
        if (messageToReply) {
            Animated.timing(height, {
                toValue: 50,
                duration: 200,
                useNativeDriver: false,
            }).start();
        }
    }, [messageToReply]);

    return (
        <View style={stylesInputChat.wrapper}>
            {messageToReply && (
                <Animated.View
                    style={{
                        ...stylesInputChat.replyContainer,
                        height: heightAnimated,
                    }}
                >
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ ...styles.textbold, marginBottom: 2, fontSize: 12 }}>
                            @{messageToReply.user.nickname}
                        </Text>
                        <UniversityTag id={messageToReply.user.universityId} fontSize={12} />
                    </View>
                    <Text style={{ ...styles.text, fontSize: 12 }}>
                        {messageToReply.message.length > 50
                            ? messageToReply.message.substring(0, 50) + '...'
                            : messageToReply.message}
                    </Text>
                    <Pressable
                        style={stylesInputChat.cancelReplyContainer}
                        onPress={handleCancelReply}
                    >
                        <View style={stylesInputChat.cancelReply}>
                            <FontAwesomeIcon icon={faXmark} color={'white'} size={12} />
                        </View>
                    </Pressable>
                </Animated.View>
            )}
            <View style={stylesInputChat.container}>
                <View
                    style={{
                        ...stylesInputChat.inputWrap,
                        ...(counter < 0 && stylesInputChat.borderTextbox),
                    }}
                >
                    <TextInput
                        placeholder=""
                        placeholderTextColor="#707070"
                        style={{
                            ...styles.textinput,
                            fontSize: 16,
                        }}
                        multiline={true}
                        value={message}
                        onChangeText={text => onChange({ message: text })}
                    />
                </View>
                <View style={{ paddingLeft: 10 }}>
                    <ButtonIcon
                        icon={faLocationArrow}
                        style={stylesInputChat.buttonIcon}
                        iconStyle={{ transform: [{ rotate: '45deg' }] }}
                        disabled={isDisabled || networkError}
                        onPress={onPress}
                    />
                    {counter <= 40 && (
                        <Text
                            style={{
                                ...stylesInputChat.counterText,
                                color: counter < 0 ? '#9b0000' : '#9C9C9C',
                            }}
                        >
                            {counter}
                        </Text>
                    )}
                </View>
            </View>
        </View>
    );
};

const stylesInputChat = StyleSheet.create({
    replyContainer: {
        ...styles.shadow,
        backgroundColor: '#d4d4d4d3',
        borderRadius: 8,
        width: '100%',
        paddingHorizontal: 15,
        paddingVertical: 5,
        justifyContent: 'center',
    },
    cancelReplyContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        right: 10,
    },
    cancelReply: {
        backgroundColor: '#01192E',
        borderRadius: 20,
        padding: 5,
    },
    wrapper: {
        bottom: 6,
        left: 0,
        right: 0,
        width: '100%',
    },
    container: {
        backgroundColor: '#E6E6E6',
        paddingHorizontal: 10,
        paddingVertical: 13,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 8,
    },
    borderTextbox: {
        borderColor: '#9b0000',
        borderWidth: 1.5,
    },
    buttonIcon: {
        paddingHorizontal: 10,
        borderRadius: 100,
        height: 36,
        width: 36,
    },
    inputWrap: {
        flex: 1,
        backgroundColor: 'white',
        paddingHorizontal: 8,
        justifyContent: 'center',
        borderRadius: 5,
    },
    counterText: {
        ...styles.text,
        fontSize: 14,
        textAlign: 'center',
        margin: 'auto',
        bottom: '-50%',
    },
});
