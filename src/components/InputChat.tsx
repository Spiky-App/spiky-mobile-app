import React, { useContext, useEffect, useState, useRef } from 'react';
import { Keyboard, TextInput, View, FlatList, Text, StyleSheet } from 'react-native';
import { faLocationArrow } from '../constants/icons/FontAwesome';
import SocketContext from '../context/Socket/Context';
import useSpikyService from '../hooks/useSpikyService';
import { styles } from '../themes/appTheme';
import { ChatMessage, User } from '../types/store';
import ButtonIcon from './common/ButtonIcon';
import { useAppSelector } from '../store/hooks';
import { selectUserAsObject } from '../store/feature/user/userSlice';

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
}: Props) => {
    const [isDisabled, setDisabled] = useState(true);
    const [isTyping, setIsTyping] = useState(false);
    const { createChatMessage } = useSpikyService();
    const { socket } = useContext(SocketContext);
    const { message } = form;
    const [counter, setCounter] = useState(0);
    const timeoutRef = useRef<null | number>(null);
    const IDEA_MAX_LENGHT = 200;
    const userObj = useAppSelector(selectUserAsObject);

    function invalid() {
        const { message: mensaje } = form;
        if (!mensaje || mensaje.length > IDEA_MAX_LENGHT) {
            return true;
        }
        return false;
    }

    async function handleCreateChatMessage() {
        const newChatMessages = await createChatMessage(conversationId, message);
        console.log('sender ', userObj);
        if (userObj) {
            socket?.emit('newChatMsg', {
                chatmsg: newChatMessages,
                userto: toUser.id,
                sender: userObj,
            });
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            setIsTyping(false);
        }
        if (newChatMessages) {
            updateChatMessages(newChatMessages);
        }
    }

    function onPress() {
        setDisabled(true);
        handleCreateChatMessage();
        onChange(DEFAULT_FORM);
        refFlatList.current?.scrollToIndex({ index: 0 });
        if (!HideKeyboardAfterSumbit) Keyboard.dismiss();
    }

    useEffect(() => {
        const messageLength = message.length;
        const counterUpdated = MAX_LENGHT - messageLength;
        setCounter(counterUpdated);
        if (messageLength <= MAX_LENGHT && messageLength > 0) {
            if (isDisabled) setDisabled(false);
        } else setDisabled(true);
        if (!isTyping && toUser.online) {
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

    return (
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
                    disabled={isDisabled || invalid()}
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
    );
};

const stylesInputChat = StyleSheet.create({
    container: {
        backgroundColor: '#E6E6E6',
        bottom: 6,
        left: 0,
        right: 0,
        paddingHorizontal: 10,
        paddingVertical: 13,
        justifyContent: 'space-between',
        flexDirection: 'row',
        flexWrap: 'wrap',
        borderRadius: 8,
        width: '100%',
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
