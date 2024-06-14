import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { faLocationArrow, faReply, faChevronLeft } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import { RootStackParamList } from '../navigator/Navigator';
import { styles } from '../themes/appTheme';
import { BackgroundPaper } from '../components/BackgroundPaper';
import ButtonIcon from '../components/common/ButtonIcon';
import useSpikyService from '../hooks/useSpikyService';
import SocketContext from '../context/Socket/Context';
import { generateConversationFromConversacion } from '../helpers/conversations';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { RootState } from '../store';
import UserComponent from '../components/common/UserComponent';
import MsgTransform from '../components/MsgTransform';
import { IdeaType } from '../types/store';

type Props = DrawerScreenProps<RootStackParamList, 'ReplyIdeaScreen'>;

export const ReplyIdeaScreen = ({ route }: Props) => {
    const dispatch = useAppDispatch();
    const uid = useAppSelector((state: RootState) => state.user.id);
    const navigation = useNavigation();
    const [counter, setCounter] = useState(0);
    const [isDisabled, setDisabled] = useState(true);
    const { createChatMsgWithReply } = useSpikyService();
    const { socket } = useContext(SocketContext);
    const repliedIdea = route.params?.idea;
    const { form, onChange } = useForm({
        messageReply: '',
    });
    const { messageReply } = form;
    const MSG_MAX_LENGHT = 200;
    const messageLenght = form.messageReply.length;

    function getPercentage(value: number, maxValue: number): number {
        return (value / maxValue) * 100;
    }

    async function onPressLocationArrow() {
        setDisabled(true);
        const content = await createChatMsgWithReply(
            repliedIdea.user.id!!,
            repliedIdea.id,
            messageReply
        );
        if (content) {
            const { userto, conver, newConver } = content;
            const converRetrived = generateConversationFromConversacion(conver, uid);
            dispatch(setModalAlert({ isOpen: true, text: 'Mensaje enviado', icon: faPaperPlane }));
            socket?.emit('newChatMsgWithReply', { conver: converRetrived, userto, newConver });
        }
        navigation.goBack();
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
        <BackgroundPaper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={stylecom.container}
            >
                <View style={{ width: '100%%', flex: 1, alignItems: 'center' }}>
                    <View style={stylecom.back_arrow}>
                        <Pressable onPress={() => navigation.goBack()} style={{ paddingRight: 6 }}>
                            <FontAwesomeIcon icon={faChevronLeft} color={'#01192E'} size={22} />
                        </Pressable>
                        <Text style={styles.h3}>
                            Crear réplica<Text style={styles.orange}>.</Text>
                        </Text>
                    </View>
                    <View style={stylecom.wrap}>
                        <View style={stylecom.msgContainer}>
                            <View style={{ ...stylecom.posAbsolute, top: 10, right: 10 }}>
                                <FontAwesomeIcon icon={faReply} color={'#bebebe'} size={18} />
                            </View>
                            <UserComponent
                                user={repliedIdea.user}
                                anonymous={false}
                                date={repliedIdea.date}
                                handleClickUser={() => {}}
                            />
                            <View style={{ paddingTop: 8 }}>
                                {repliedIdea.type === IdeaType.MOOD ? (
                                    <View
                                        style={{
                                            alignSelf: 'flex-start',
                                            flexDirection: 'row',
                                            marginBottom: 10,
                                        }}
                                    >
                                        <View style={{ marginRight: 6 }}>
                                            <View style={[styles.center, { flexGrow: 1 }]}>
                                                <Text style={{ fontSize: 24 }}>
                                                    {repliedIdea.message.substring(
                                                        0,
                                                        repliedIdea.message.indexOf('|')
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ paddingVertical: 6, flexShrink: 1 }}>
                                            <MsgTransform
                                                textStyle={{ ...styles.idea_msg, fontSize: 12 }}
                                                text={repliedIdea.message.substring(
                                                    repliedIdea.message.indexOf('|') + 1
                                                )}
                                                handleClickUser={() => {}}
                                                handleClickHashtag={() => {}}
                                                handleClickLink={async () => {}}
                                            />
                                        </View>
                                    </View>
                                ) : (
                                    <View style={{ marginBottom: 10 }}>
                                        <MsgTransform
                                            textStyle={{ ...styles.idea_msg, fontSize: 12 }}
                                            text={repliedIdea.message}
                                            handleClickUser={() => {}}
                                            handleClickHashtag={() => {}}
                                            handleClickLink={async () => {}}
                                        />
                                    </View>
                                )}
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
                            <View style={stylecom.WrapAbsoluteCenter}>
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
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            width: '90%',
                            marginTop: 10,
                        }}
                    >
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
        width: '92%',
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
        backgroundColor: styles.button_container.backgroundColor,
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    posAbsolute: {
        position: 'absolute',
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
    WrapAbsoluteCenter: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        marginHorizontal: 25,
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
    back_arrow: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%',
    },
});
