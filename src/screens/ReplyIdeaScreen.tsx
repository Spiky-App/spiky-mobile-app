import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { faLocationArrow, faReply } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import { RootStackParamList } from '../navigator/Navigator';
import { styles } from '../themes/appTheme';
import { BackgroundPaper } from '../components/BackgroundPaper';
import ButtonIcon from '../components/common/ButtonIcon';
import { getTime } from '../helpers/getTime';
import useSpikyService from '../hooks/useSpikyService';
import { transformMsg } from '../helpers/transformMsg';
import SocketContext from '../context/Socket/Context';
import UniversityTag from '../components/common/UniversityTag';

type Props = DrawerScreenProps<RootStackParamList, 'ReplyIdeaScreen'>;

export const ReplyIdeaScreen = ({ route }: Props) => {
    const navigation = useNavigation();
    const [counter, setCounter] = useState(0);
    const [isDisabled, setDisabled] = useState(true);
    const { createChatMsgWithReply } = useSpikyService();
    const { socket } = useContext(SocketContext);
    const { message, messageId, user, date } = route.params?.message;
    const { form, onChange } = useForm({
        messageReply: '',
    });
    const { messageReply } = form;
    const fecha = getTime(date.toString());
    const MSG_MAX_LENGHT = 200;
    const messageLenght = form.messageReply.length;

    function getPercentage(value: number, maxValue: number): number {
        return (value / maxValue) * 100;
    }

    async function onPressLocationArrow() {
        setDisabled(true);
        const content = await createChatMsgWithReply(user.id, messageId, messageReply);
        if (content) {
            const { conver, newConver, userto } = content;
            socket?.emit('newChatMsgWithReply', { conver, userto, newConver });
        }
        setDisabled(false);
    }

    useEffect(() => {
        const { messageReply: mensaje } = form;
        setCounter(MSG_MAX_LENGHT - mensaje.length);
    }, [form]);

    useEffect(() => {
        const counterUpdated = MSG_MAX_LENGHT - messageReply.length;
        setCounter(counterUpdated);
        if (messageReply.length <= MSG_MAX_LENGHT && messageReply.length > 0) {
            if (isDisabled) {
                setDisabled(false);
            }
        } else {
            setDisabled(true);
        }
    }, [messageReply]);

    return (
        <BackgroundPaper style={stylecom.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={stylecom.container}
            >
                <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
                    <View style={stylecom.wrap}>
                        <View style={stylecom.msgContainer}>
                            <View style={{ ...stylecom.posAbsolute, top: 10 }}>
                                <FontAwesomeIcon icon={faReply} color={'#bebebe'} size={18} />
                            </View>
                            <View style={styles.flex}>
                                <Text style={{ ...styles.user, ...styles.textbold }}>
                                    @{user.nickname}
                                </Text>
                                <UniversityTag id={user.universityId} fontSize={13} />
                            </View>
                            <View style={{ paddingTop: 8 }}>
                                <Text style={{ ...styles.text, fontSize: 13 }}>
                                    {transformMsg(message)}
                                </Text>
                            </View>
                            <View style={{ ...stylecom.posAbsolute, bottom: 4 }}>
                                <Text style={{ ...styles.textGray, fontSize: 12 }}>{fecha}</Text>
                            </View>
                        </View>
                        <View style={stylecom.containerInput}>
                            <TextInput
                                placeholder="Escribe algo..."
                                placeholderTextColor="#707070"
                                style={{ ...styles.textinput, fontSize: 16, fontWeight: '300' }}
                                multiline={true}
                                onChangeText={value => onChange({ messageReply: value })}
                                autoFocus
                            />
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '90%',
                            position: 'absolute',
                            bottom: 20,
                        }}
                    >
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={{ ...styles.text, ...styles.linkPad }}>Cancelar</Text>
                        </TouchableOpacity>

                        <View style={stylecom.WrapperMaxCounterNIdea}>
                            <View style={stylecom.ConteMaxCounterNIdea}>
                                <View style={stylecom.MaxCounterNIdea}></View>
                                {counter <= 40 && (
                                    <Text
                                        style={
                                            counter < 0
                                                ? stylecom.MaxCounterTextNIdeaRed
                                                : stylecom.MaxCounterTextNIdea
                                        }
                                    >
                                        {counter}
                                    </Text>
                                )}
                                <View
                                    style={[
                                        counter < 0
                                            ? stylecom.MaxCounterNIdeaColorRed
                                            : stylecom.MaxCounterNIdeaColor,
                                        {
                                            width:
                                                getPercentage(
                                                    messageLenght < MSG_MAX_LENGHT
                                                        ? messageLenght
                                                        : MSG_MAX_LENGHT,
                                                    MSG_MAX_LENGHT
                                                ) + '%',
                                        },
                                    ]}
                                />
                            </View>
                        </View>

                        <ButtonIcon
                            disabled={isDisabled}
                            icon={faLocationArrow}
                            onPress={onPressLocationArrow}
                            iconStyle={{ transform: [{ rotate: '45deg' }] }}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </BackgroundPaper>
    );
};

const stylecom = StyleSheet.create({
    container: {
        width: '95%',
        flex: 1,
        marginTop: 15,
        marginHorizontal: 20,
    },
    wrap: {
        ...styles.shadow,
        flex: 1,
        borderRadius: 10,
        width: '100%',
        backgroundColor: 'white',
    },
    msgContainer: {
        width: '100%',
        backgroundColor: '#e8e6e6',
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 4,
    },
    posAbsolute: {
        position: 'absolute',
        right: 10,
    },
    containerInput: {
        flex: 1,
        width: '100%',
        paddingHorizontal: 25,
        paddingVertical: 15,
    },
    circleButton: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 45,
        height: 45,
        borderWidth: 1,
        borderRadius: 30,
    },
    WrapperMaxCounterNIdea: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ConteMaxCounterNIdea: {
        zIndex: 3,
        width: 100,
        margin: 'auto',
    },
    MaxCounterNIdea: {
        backgroundColor: '#d4d4d4d3',
        width: 100,
        height: 3,
        borderRadius: 5,
    },
    MaxCounterTextNIdea: {
        position: 'absolute',
        top: 0,
        fontSize: 14,
        fontWeight: '300',
        color: '#9C9C9C',
        paddingTop: 6,
        width: '100%',
        textAlign: 'center',
        margin: 'auto',
    },
    MaxCounterTextNIdeaRed: {
        position: 'absolute',
        top: 0,
        fontSize: 14,
        fontWeight: '300',
        color: '#9b0000',
        paddingTop: 6,
        width: '100%',
        textAlign: 'center',
        margin: 'auto',
    },
    MaxCounterNIdeaColor: {
        position: 'absolute',
        top: 0,
        zIndex: 3,
        width: 60,
        height: 3,
        borderRadius: 5,
        backgroundColor: '#01192E',
    },
    MaxCounterNIdeaColorRed: {
        position: 'absolute',
        top: 0,
        zIndex: 3,
        width: 60,
        height: 3,
        borderRadius: 5,
        backgroundColor: '#9b0000',
    },
});
