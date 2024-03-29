import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MentionInput } from 'react-native-controlled-mentions';
import {
    faLocationArrow,
    faPenToSquare,
    faSquarePollHorizontal,
    faXmark,
    faFlagCheckered,
} from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { addMessage, setDraft, updateMessage } from '../store/feature/messages/messagesSlice';
import ButtonIcon from '../components/common/ButtonIcon';
import { MentionData } from 'react-native-controlled-mentions/dist/types';
import { RenderSuggetions } from '../components/Suggestions';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import useSpikyService from '../hooks/useSpikyService';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { generateMessageFromMensaje } from '../helpers/message';
import SocketContext from '../context/Socket/Context';
import { Message } from '../types/store';
import { StackNavigationProp } from '@react-navigation/stack';

type NavigationDrawerProp = DrawerNavigationProp<DrawerParamList>;
type NavigationStackProp = StackNavigationProp<RootStackParamList>;
type Props = DrawerScreenProps<RootStackParamList, 'CreateIdeaScreen'>;

export const CreateIdeaScreen = ({ route }: Props) => {
    const draftedIdea = route.params?.draftedIdea;
    const idDraft = route.params?.draftID;
    const isDraft = idDraft !== undefined;
    const dispatch = useAppDispatch();
    const { form, onChange } = useForm({
        message: draftedIdea || '',
    });
    const navDrawer = useNavigation<NavigationDrawerProp>();
    const navStack = useNavigation<NavigationStackProp>();
    const [counter, setCounter] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const { createIdea, updateDraft } = useSpikyService();
    const IDEA_MAX_LENGHT = 220;
    const { draft } = useAppSelector((state: RootState) => state.messages);
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
        const mensaje = await createIdea(form.message);
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
            return createdMessage;
        }
        return undefined;
    }

    async function handleUpdateDraft(id: number, post: boolean): Promise<Message | undefined> {
        const mensaje = await updateDraft(form.message, id, post);
        if (mensaje) {
            return generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: user.nickname,
                    id_universidad: user.universityId,
                },
                reacciones: [],
                encuesta_opciones: [],
            });
        }
        return undefined;
    }

    async function onPressLocationArrow() {
        setLoading(true);
        const message = idDraft ? await handleUpdateDraft(idDraft, true) : await handleCreateIdea();
        if (message) {
            dispatch(setDraft(false));
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
    async function onPressPenToSquare() {
        setLoading(true);
        if (isDraft) {
            const message = await handleUpdateDraft(idDraft, false);
            if (message) {
                if (draft) {
                    dispatch(updateMessage(message));
                }
                navDrawer.goBack();
                dispatch(
                    setModalAlert({
                        isOpen: true,
                        text: 'Borrador actualizado.',
                        icon: faPenToSquare,
                    })
                );
            }
        } else {
            const message = await createIdea(form.message, true);
            if (message) {
                if (draft) {
                    dispatch(addMessage(generateMessageFromMensaje(message)));
                }
                navDrawer.goBack();
                dispatch(
                    setModalAlert({ isOpen: true, text: 'Borrador guardado.', icon: faPenToSquare })
                );
            }
        }

        setLoading(false);
    }

    useEffect(() => {
        const { message: mensaje } = form;
        setCounter(IDEA_MAX_LENGHT - mensaje.length);
    }, [form]);

    const messageLenght = form.message.length;

    return (
        <BackgroundPaper style={stylecom.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={stylecom.container}
            >
                <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
                    <View style={stylecom.wrap}>
                        <View style={{ position: 'absolute', top: 8, right: 8 }}>
                            <ButtonIcon
                                disabled={isLoading}
                                icon={faXmark}
                                onPress={() => navDrawer.goBack()}
                                style={{ height: 24, width: 24, backgroundColor: '#D4D4D4' }}
                            />
                        </View>
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
                        <ButtonIcon
                            disabled={isLoading}
                            icon={faSquarePollHorizontal}
                            onPress={() => navStack.replace('CreatePollScreen')}
                        />
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
                        <ButtonIcon
                            disabled={isLoading || invalid()}
                            icon={faPenToSquare}
                            onPress={onPressPenToSquare}
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
        width: '95%',
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
        paddingTop: 30,
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
});
