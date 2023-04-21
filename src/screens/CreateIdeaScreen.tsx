import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MentionInput } from 'react-native-controlled-mentions';
import {
    faLocationArrow,
    faPenToSquare,
    faFlagCheckered,
    faChevronLeft,
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
import { ModalConfirmation } from '../components/ModalConfirmation';
import ToggleButton from '../components/common/ToggleButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

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
    const [activeConfirmation, setActiveConfirmation] = useState(false);
    const [isSuperAnonymous, setIsSuperAnonymous] = useState(false);
    const [isOpenDrafConfirmation, setIsOpenDrafConfirmation] = useState(false);
    const [callbackDrafConfirmation, setCallbackDrafConfirmation] = useState(() => () => {});
    const [callbackDrafCancel, setCallbackDrafCancel] = useState(() => () => {});
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
        const mensaje = await createIdea(form.message, 0, undefined, isSuperAnonymous);
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
    async function onPressPenToSquare(callbackAfter: Function) {
        setLoading(true);
        if (isDraft) {
            const message = await handleUpdateDraft(idDraft, false);
            if (message) {
                if (draft) {
                    dispatch(updateMessage(message));
                }
                callbackAfter();
                dispatch(
                    setModalAlert({
                        isOpen: true,
                        text: 'Borrador actualizado.',
                        icon: faPenToSquare,
                    })
                );
            }
        } else {
            const mensaje = await createIdea(form.message, 1);
            if (mensaje) {
                if (draft) {
                    dispatch(
                        addMessage(
                            generateMessageFromMensaje({
                                ...mensaje,
                                usuario: {
                                    alias: user.nickname,
                                    id_universidad: user.universityId,
                                },
                                reacciones: [],
                                encuesta_opciones: [],
                            })
                        )
                    );
                }
                callbackAfter();
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
        if (mensaje.length > 0 && draftedIdea !== mensaje && !activeConfirmation)
            setActiveConfirmation(true);
        if (mensaje.length === 0 && activeConfirmation) setActiveConfirmation(false);
    }, [form, activeConfirmation, draftedIdea]);

    useEffect(() => {
        const unsubscribe = navStack.addListener('beforeRemove', e => {
            if (!activeConfirmation || isLoading) {
                return;
            }
            e.preventDefault();
            setCallbackDrafConfirmation(
                () => () => onPressPenToSquare(() => navStack.dispatch(e.data.action))
            );
            setCallbackDrafCancel(() => () => navStack.dispatch(e.data.action));
            setIsOpenDrafConfirmation(true);
        });

        return unsubscribe;
    }, [navStack, activeConfirmation, form, isLoading]);

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
                            Crear idea<Text style={styles.orange}>.</Text>
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
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <ToggleButton
                                isActive={isSuperAnonymous}
                                setIsActive={setIsSuperAnonymous}
                                text={['Super', 'anónimo']}
                            />
                        </View>
                        <View style={styles.flex_center}>
                            <ButtonIcon
                                disabled={isLoading || invalid()}
                                icon={faPenToSquare}
                                onPress={() => onPressPenToSquare(() => navDrawer.goBack())}
                            />
                            <View style={{ margin: 10 }} />
                            <ButtonIcon
                                disabled={isLoading || invalid()}
                                icon={faLocationArrow}
                                onPress={onPressLocationArrow}
                                iconStyle={{ transform: [{ rotate: '45deg' }] }}
                            />
                        </View>
                    </View>
                </View>
                <ModalConfirmation
                    isOpen={isOpenDrafConfirmation}
                    callback={callbackDrafConfirmation}
                    callbackCancel={callbackDrafCancel}
                    setIsOpen={setIsOpenDrafConfirmation}
                    text={'¿Quieres guardar como borrador tu idea incompleta?'}
                    confirmationText={'Sí, guardar'}
                />
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
        paddingTop: 20,
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
});
