import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MentionInput } from 'react-native-controlled-mentions';
import { faLocationArrow, faChevronLeft, faFlagCheckered } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import ButtonIcon from '../components/common/ButtonIcon';
import { MentionData } from 'react-native-controlled-mentions/dist/types';
import { RenderSuggetions } from '../components/Suggestions';
import useSpikyService from '../hooks/useSpikyService';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { generateMessageFromMensaje } from '../helpers/message';
import SocketContext from '../context/Socket/Context';
import { IdeaType, Message } from '../types/store';
import ToggleButton from '../components/common/ToggleButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { addMessage, setMessages } from '../store/feature/messages/messagesSlice';
import UserComponent from '../components/common/UserComponent';
import MsgTransform from '../components/MsgTransform';

type NavigationDrawerProp = DrawerNavigationProp<DrawerParamList>;
type Props = DrawerScreenProps<RootStackParamList, 'CreateQuoteScreen'>;

export const CreateQuoteScreen = ({ route }: Props) => {
    const { idea: quote } = route.params;
    const { form, onChange } = useForm({
        message: '',
    });
    const dispatch = useAppDispatch();
    const messages = useAppSelector((state: RootState) => state.messages.messages);
    const navDrawer = useNavigation<NavigationDrawerProp>();
    const [counter, setCounter] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [isSuperAnonymous, setIsSuperAnonymous] = useState(false);
    const { createIdea } = useSpikyService();
    const IDEA_MAX_LENGHT = 220;
    const user = useAppSelector((state: RootState) => state.user);
    const { socket } = useContext(SocketContext);

    function invalid() {
        const { message: mensaje } = form;
        if (!mensaje || mensaje.length > IDEA_MAX_LENGHT) {
            return true;
        }
        return false;
    }

    function getPercentage(value: number, maxValue: number): number {
        return (value / maxValue) * 100;
    }

    async function handleCreateIdea(): Promise<Message | undefined> {
        const mensaje = await createIdea(form.message, IdeaType.QUOTE, quote.id, isSuperAnonymous);

        if (mensaje) {
            const createdMessage: Message = generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: user.nickname,
                    id_universidad: user.universityId,
                },
                reacciones: [],
                encuesta_opciones: [],
            });
            const regexp = /(@\[@\w*\]\(\d*\))/g;
            const mentions: RegExpMatchArray | null = createdMessage.message.match(regexp);
            if (mentions) {
                socket?.emit('mentions', {
                    mentions,
                    id_usuario2: user.id,
                    id_mensaje: createdMessage.id,
                    tipo: 4,
                });
            }
            const messagesUpdated = messages.map((msg: Message) => {
                if (msg.id === quote.id) {
                    socket?.emit('notify', {
                        id_usuario1: msg.user.id,
                        id_usuario2: user.id,
                        id_mensaje: msg.id,
                        tipo: 9,
                    });
                    return {
                        ...msg,
                        totalX2: msg.totalX2 + 1,
                        myX2: true,
                    };
                } else {
                    return msg;
                }
            });
            dispatch(setMessages(messagesUpdated));
            return createdMessage;
        }
        return undefined;
    }

    async function onPressLocationArrow() {
        setLoading(true);
        const message = await handleCreateIdea();
        if (message) {
            navDrawer.navigate('CommunityScreen');
            dispatch(addMessage(message));
            dispatch(
                setModalAlert({
                    isOpen: true,
                    text: 'Idea publicada.',
                    icon: faFlagCheckered,
                })
            );
        }
        setLoading(false);
    }

    useEffect(() => {
        const { message: mensaje } = form;
        setCounter(IDEA_MAX_LENGHT - mensaje.length);
    }, [form]);

    const messageLenght = form.message.length;

    return (
        <BackgroundPaper>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={stylecom.container}
            >
                <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
                    <View style={stylecom.back_arrow}>
                        <Pressable onPress={() => navDrawer.goBack()} style={{ paddingRight: 6 }}>
                            <FontAwesomeIcon icon={faChevronLeft} color={'#01192E'} size={22} />
                        </Pressable>
                        <Text style={styles.h3}>
                            Citar idea<Text style={styles.orange}>.</Text>
                        </Text>
                    </View>
                    <View style={stylecom.wrap}>
                        <MentionInput
                            placeholder="Perpetua tu idea.."
                            placeholderTextColor="#707070"
                            style={{ ...styles.textinput, fontSize: 16 }}
                            multiline={true}
                            autoFocus
                            value={form.message}
                            onChange={value => onChange({ message: value })}
                            partTypes={[
                                {
                                    trigger: '@',
                                    renderSuggestions: props =>
                                        RenderSuggetions({ ...props, isMention: true }),
                                    textStyle: { ...styles.h5, color: '#5c71ad' },
                                    allowedSpacesCount: 0,
                                    isInsertSpaceAfterMention: true,
                                    isBottomMentionSuggestionsRender: true,
                                    getPlainString: ({ name }: MentionData) => name,
                                },
                                {
                                    trigger: '#',
                                    renderSuggestions: props =>
                                        RenderSuggetions({ ...props, isMention: false }),
                                    textStyle: { ...styles.h5, color: '#5c71ad' },
                                    allowedSpacesCount: 0,
                                    isInsertSpaceAfterMention: true,
                                    isBottomMentionSuggestionsRender: true,
                                    getPlainString: ({ name }: MentionData) => name,
                                },
                            ]}
                        />
                        <View style={stylecom.quote_container}>
                            {quote.type === IdeaType.MOOD ? (
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
                                                {quote.message.substring(
                                                    0,
                                                    quote.message.indexOf('|')
                                                )}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ paddingVertical: 6, flexShrink: 1 }}>
                                        <MsgTransform
                                            textStyle={{ ...styles.idea_msg, fontSize: 12 }}
                                            text={quote.message.substring(
                                                quote.message.indexOf('|') + 1
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
                                        text={quote.message}
                                        handleClickUser={() => {}}
                                        handleClickHashtag={() => {}}
                                        handleClickLink={async () => {}}
                                    />
                                </View>
                            )}
                            <View style={styles.flex_start}>
                                <Text style={{ ...styles.idea_msg, fontSize: 10 }}>—</Text>
                                <UserComponent
                                    user={quote.user}
                                    anonymous={quote.anonymous}
                                    date={quote.date}
                                    handleClickUser={() => () => {}}
                                    small
                                />
                            </View>
                        </View>
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
                                                        messageLenght < IDEA_MAX_LENGHT
                                                            ? messageLenght
                                                            : IDEA_MAX_LENGHT,
                                                        IDEA_MAX_LENGHT
                                                    ) + '%',
                                            },
                                        ]}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '90%',
                            marginTop: 10,
                        }}
                    >
                        <ToggleButton
                            isActive={isSuperAnonymous}
                            setIsActive={setIsSuperAnonymous}
                            text={['Super', 'anónimo']}
                        />
                        <ButtonIcon
                            disabled={isLoading || invalid()}
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
        marginBottom: 10,
        marginHorizontal: 20,
    },
    wrap: {
        ...styles.shadow,
        flex: 1,
        borderRadius: 10,
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 25,
        paddingVertical: 20,
        overflow: 'scroll',
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
        // flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ConteMaxCounterNIdea: {
        zIndex: 3,
        width: 100,
        margin: 'auto',
        // backgroundColor: 'green'
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
    quote_container: {
        backgroundColor: '#eeeeef',
        alignItems: 'flex-start',
        justifyContent: 'center',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginTop: 10,
    },
});
