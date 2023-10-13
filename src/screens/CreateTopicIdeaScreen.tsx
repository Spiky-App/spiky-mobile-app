import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Platform, KeyboardAvoidingView, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MentionInput } from 'react-native-controlled-mentions';
import {
    faLocationArrow,
    faFlagCheckered,
    faChevronLeft,
    faRotate,
} from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { addMessage } from '../store/feature/messages/messagesSlice';
import ButtonIcon from '../components/common/ButtonIcon';
import { MentionData } from 'react-native-controlled-mentions/dist/types';
import { RenderSuggetions } from '../components/Suggestions';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import useSpikyService from '../hooks/useSpikyService';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { generateMessageFromMensaje } from '../helpers/message';
import SocketContext from '../context/Socket/Context';
import { IdeaType, Idea, TopicQuestion } from '../types/store';
import ToggleButton from '../components/common/ToggleButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { addToast } from '../store/feature/toast/toastSlice';
import { StatusType } from '../types/common';
import { useAnimation } from '../hooks/useAnimation';
import { Animated } from 'react-native';

type NavigationDrawerProp = DrawerNavigationProp<DrawerParamList>;
type Props = DrawerScreenProps<RootStackParamList, 'CreateTopicIdeaScreen'>;

export const CreateTopicIdeaScreen = ({ route }: Props) => {
    const topic = route.params?.topic;
    const dispatch = useAppDispatch();
    const { form, onChange } = useForm({
        message: '',
    });
    const navDrawer = useNavigation<NavigationDrawerProp>();
    const [counter, setCounter] = useState(0);
    const [isLoading, setLoading] = useState(false);
    const [isSuperAnonymous, setIsSuperAnonymous] = useState(false);
    const [networkError, setNetworkError] = useState(false);
    const [topicQuestion, setTopicQuestion] = useState<TopicQuestion | undefined>(
        route.params?.topicQuestion
    );
    const { createIdea, getRandomTopicQuestion } = useSpikyService();
    const IDEA_MAX_LENGHT = 220;
    const user = useAppSelector((state: RootState) => state.user);
    const { socket } = useContext(SocketContext);
    const { movingPosition, position } = useAnimation({
        init_position: 0,
    });

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
        const mensaje = await createIdea(
            form.message,
            IdeaType.TOPIC,
            undefined,
            isSuperAnonymous,
            topicQuestion?.id
        );
        if (mensaje) {
            const createdMessage: Idea = generateMessageFromMensaje({
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

    async function handleGetRandomTopicQuestion() {
        setLoading(true);
        if (topic) {
            const { topicQuestion: topicQuestionRetrieved, networkError: networkErrorRetrieved } =
                await getRandomTopicQuestion(topic?.id);
            if (topicQuestionRetrieved) setTopicQuestion(topicQuestionRetrieved);
            if (networkErrorRetrieved) setNetworkError(true);
            if (!topicQuestionRetrieved && !networkErrorRetrieved) {
                dispatch(
                    addToast({
                        message: 'Ya contestate todas las preguntas sobre este tema.',
                        type: StatusType.INFORMATION,
                    })
                );
                navDrawer.goBack();
            }
        }
        setLoading(false);
    }

    function handleBoucingInAnimation() {
        movingPosition(-100, 0, 600);
    }

    function handleBoucingOutAnimation() {
        movingPosition(0, 100, 600, handleGetRandomTopicQuestion);
    }

    useEffect(() => {
        const { message: mensaje } = form;
        setCounter(IDEA_MAX_LENGHT - mensaje.length);
    }, [form]);

    useEffect(() => {
        if (!topicQuestion) {
            handleGetRandomTopicQuestion();
        } else {
            handleBoucingInAnimation();
        }
    }, [topicQuestion]);

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
                    <View
                        style={[
                            stylecom.wrap_topic,
                            {
                                backgroundColor: topicQuestion
                                    ? topicQuestion.topic.backgroundColor
                                    : topic?.backgroundColor,
                            },
                        ]}
                    >
                        <View style={stylecom.topic}>
                            <View style={stylecom.emoji_container}>
                                <Text style={styles.h6}>
                                    {topicQuestion ? topicQuestion.topic.emoji : topic?.emoji}
                                </Text>
                            </View>
                            {topicQuestion && !isLoading && (
                                <Animated.View
                                    style={[
                                        stylecom.question_container,
                                        { transform: [{ translateY: position }] },
                                    ]}
                                >
                                    <Text style={styles.idea_msg}>{topicQuestion?.question}</Text>
                                </Animated.View>
                            )}
                            {networkError && (
                                <Text style={[styles.textGray, { fontSize: 14 }]}>
                                    Revisa tu conexión a internet.
                                </Text>
                            )}
                            {!networkError && !isLoading && !topicQuestion && (
                                <Text style={[styles.textGray, { fontSize: 14 }]}>
                                    Uups... algo salió mal, vuelve a intentarlo.
                                </Text>
                            )}
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
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            width: '90%',
                            paddingVertical: 10,
                        }}
                    >
                        <ToggleButton
                            isActive={isSuperAnonymous}
                            setIsActive={setIsSuperAnonymous}
                            text={['Super', 'anónimo']}
                        />
                        <View style={styles.flex_center}>
                            <View style={[styles.flex_center, { marginRight: 10 }]}>
                                <View style={{ marginRight: 10 }}>
                                    <Text
                                        style={[
                                            styles.textGray,
                                            isLoading && { color: styles.text.color },
                                        ]}
                                    >
                                        Cambiar
                                    </Text>
                                    <Text
                                        style={[
                                            styles.textGray,
                                            isLoading && { color: styles.text.color },
                                        ]}
                                    >
                                        pregunta
                                    </Text>
                                </View>
                                <ButtonIcon
                                    disabled={isLoading}
                                    icon={faRotate}
                                    onPress={handleBoucingOutAnimation}
                                />
                            </View>
                            <ButtonIcon
                                disabled={isLoading || invalid()}
                                icon={faLocationArrow}
                                onPress={onPressLocationArrow}
                                iconStyle={{ transform: [{ rotate: '45deg' }] }}
                            />
                        </View>
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
        position: 'relative',
    },
    wrap_topic: {
        ...styles.shadow,
        flex: 1,
        borderRadius: 14,
        width: '100%',
        position: 'relative',
    },
    topic: {
        ...styles.flex_start,
        width: '100%',
        paddingHorizontal: 15,
        marginVertical: 15,
        minHeight: 70,
        position: 'relative',
        overflow: 'hidden',
    },
    question_container: {
        ...styles.flex_start,
        position: 'relative',
        width: '100%',
        height: '100%',
        flex: 1,
    },
    question_subcontainer: {
        width: '100%',
        position: 'absolute',
        backgroundColor: 'red',
        bottom: '100%',
        zIndex: 2,
    },
    wrap: {
        flex: 1,
        borderRadius: 14,
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 25,
        paddingTop: 20,
        paddingBottom: 32,
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
    emoji_container: {
        ...styles.flex_center,
        backgroundColor: '#ffff',
        borderRadius: 15,
        height: 35,
        width: 35,
        marginRight: 10,
    },
});
