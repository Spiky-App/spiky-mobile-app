import React, { useContext, useEffect, useState } from 'react';
import { Keyboard, TextInput, View, FlatList } from 'react-native';
import { faLocationArrow } from '../constants/icons/FontAwesome';
import SocketContext from '../context/Socket/Context';
import useSpikyService from '../hooks/useSpikyService';
import { styles } from '../themes/appTheme';
import { ChatMessage, User } from '../types/store';
import ButtonIcon from './common/ButtonIcon';

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
    const [, setCounter] = useState(0);
    const [isDisabled, setDisabled] = useState(true);
    const { createChatMessage } = useSpikyService();
    const { SocketState } = useContext(SocketContext);
    const { message } = form;

    async function onPress() {
        setDisabled(true);
        const newChatMessages = await createChatMessage(conversationId, message);
        SocketState.socket?.emit('newChatMsg', {
            chatmsg: newChatMessages,
            converId: conversationId,
            userto: toUser.id,
        });
        if (newChatMessages) {
            updateChatMessages(newChatMessages);
        }
        onChange(DEFAULT_FORM);
        refFlatList.current?.scrollToIndex({ index: 0 });
        if (!HideKeyboardAfterSumbit) Keyboard.dismiss();
        setDisabled(false);
    }

    useEffect(() => {
        const counterUpdated = MAX_LENGHT - message.length;
        setCounter(counterUpdated);
        if (message.length <= MAX_LENGHT && message.length > 0) {
            if (isDisabled) {
                setDisabled(false);
            }
        } else {
            setDisabled(true);
        }
    }, [message]);

    return (
        <View
            style={{
                backgroundColor: '#E6E6E6',
                bottom: 0,
                left: 0,
                right: 0,
                paddingHorizontal: 10,
                paddingVertical: 15,
                justifyContent: 'center',
                flexDirection: 'row',
                flexWrap: 'wrap',
                borderRadius: 8,
                width: '100%',
            }}
        >
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    paddingHorizontal: 8,
                    justifyContent: 'center',
                    borderRadius: 5,
                }}
            >
                <TextInput
                    placeholder=""
                    placeholderTextColor="#707070"
                    style={{ ...styles.textinput, fontSize: 16 }}
                    multiline={true}
                    value={message}
                    onChangeText={text => onChange({ message: text })}
                />
            </View>
            <View style={{ paddingLeft: 6 }}>
                <ButtonIcon
                    icon={faLocationArrow}
                    style={{
                        paddingHorizontal: 10,
                        justifyContent: 'center',
                        borderRadius: 100,
                        height: 40,
                        width: 40,
                    }}
                    iconStyle={{ transform: [{ rotate: '45deg' }] }}
                    disabled={isDisabled}
                    onPress={onPress}
                />
            </View>
        </View>
    );
};
