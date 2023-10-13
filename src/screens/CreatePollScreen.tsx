import React, { createRef, useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Platform,
    KeyboardAvoidingView,
    TextInput,
    Text,
    Keyboard,
    Animated,
    TouchableWithoutFeedback,
    ScrollView,
    Pressable,
} from 'react-native';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { BackgroundPaper } from '../components/BackgroundPaper';
import ButtonIcon from '../components/common/ButtonIcon';
import { faLocationArrow, faFlagCheckered, faChevronLeft } from '../constants/icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useAnimation } from '../hooks/useAnimation';
import useSpikyService from '../hooks/useSpikyService';
import { generateMessageFromMensaje } from '../helpers/message';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import { addMessage } from '../store/feature/messages/messagesSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import ToggleButton from '../components/common/ToggleButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { Idea } from '../types/store';

type NavigationDrawerProp = DrawerNavigationProp<DrawerParamList>;
interface Form {
    question: string;
    answers: Answer[];
}
interface Answer {
    id: number;
    answer: string;
    ref: React.RefObject<TextInput>;
    duplicated?: boolean;
}

export const CreatePollScreen = () => {
    const QUESTION_MAX_LENGHT = 220;
    const ANSWER_MAX_LENGHT = 180;
    const ANSWER_MAX = 5;
    const user = useAppSelector((state: RootState) => state.user);
    const navDrawer = useNavigation<NavigationDrawerProp>();
    const { createPoll } = useSpikyService();
    const dispatch = useAppDispatch();
    const [isLoading, setLoading] = useState(false);
    const [isSuperAnonymous, setIsSuperAnonymous] = useState(false);
    const { form, onChange } = useForm<Form>({
        question: '',
        answers: [
            { id: 1, answer: '', ref: createRef<TextInput>() },
            { id: 2, answer: '', ref: createRef<TextInput>() },
        ],
    });
    const { question, answers } = form;

    function invalid() {
        const answers_duplicated = answers.filter(a => a.duplicated);
        if (
            question === '' ||
            answers[0].answer === '' ||
            answers[1].answer === '' ||
            answers_duplicated.length > 0
        ) {
            return true;
        }
        return false;
    }

    function handleChangeAnswers(answer: Answer) {
        const answers_duplicated = answers.filter(
            a => a.answer === answer.answer && a.answer !== ''
        );
        let newAnswer = answers.map(a => {
            if (answer.id === a.id) {
                return { ...answer, duplicated: answers_duplicated.length > 0 };
            } else {
                return a;
            }
        });
        if (answer.answer.length <= ANSWER_MAX_LENGHT) {
            if (
                answers[answers.length - 1].id === answer.id &&
                answer.answer.length > 0 &&
                answers.length < ANSWER_MAX
            ) {
                onChange({
                    answers: [
                        ...newAnswer,
                        { id: answers.length + 1, answer: '', ref: createRef<TextInput>() },
                    ],
                });
            } else {
                onChange({ answers: newAnswer });
            }
        }
    }

    function handleOnBlurAnswer(
        answer: Answer,
        fadeOut: (duration?: number, callback?: () => void) => void
    ) {
        if (answers.length > 2 && answer.answer.length === 0 && answer.id !== answers.length) {
            let newAnswer: Answer[] = [];
            answers.forEach(a => {
                if (a.id !== answer.id) {
                    newAnswer.push({
                        id: answer.id < a.id ? a.id - 1 : a.id,
                        answer: a.answer,
                        ref: a.ref,
                    });
                }
            });
            if (newAnswer[newAnswer.length - 1].answer.length !== 0)
                newAnswer.push({
                    id: newAnswer.length + 1,
                    answer: '',
                    ref: createRef<TextInput>(),
                });
            fadeOut(350, () => onChange({ answers: newAnswer }));
        }
    }

    async function handleCreatePoll() {
        setLoading(true);
        let answers_array: string[] = [];
        answers.forEach(a => {
            if (a.answer !== '') answers_array.push(a.answer);
        });
        const mensaje = await createPoll(question, answers_array, isSuperAnonymous);
        if (mensaje) {
            const createdMessage: Idea = generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: user.nickname,
                    id_universidad: user.universityId,
                },
                reacciones: [],
            });
            navDrawer.navigate('CommunityScreen');
            dispatch(addMessage(createdMessage));
            dispatch(
                setModalAlert({
                    isOpen: true,
                    text: 'Encuesta publicada.',
                    icon: faFlagCheckered,
                })
            );
        }
        setLoading(false);
    }

    return (
        <BackgroundPaper>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    style={[stylecom.container]}
                >
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={{ marginVertical: 4 }}>
                            <View style={stylecom.back_arrow}>
                                <Pressable
                                    onPress={() => navDrawer.goBack()}
                                    style={{ paddingRight: 6 }}
                                >
                                    <FontAwesomeIcon
                                        icon={faChevronLeft}
                                        color={'#01192E'}
                                        size={22}
                                    />
                                </Pressable>
                                <Text style={styles.h3}>
                                    Crear encuesta<Text style={styles.orange}>.</Text>
                                </Text>
                            </View>
                        </View>
                        <View style={stylecom.input1}>
                            <TextInput
                                placeholder="Haz una pregunta"
                                placeholderTextColor="#707070"
                                autoFocus
                                multiline={true}
                                style={{
                                    ...styles.textinput,
                                    fontSize: 16,
                                    width: '100%',
                                }}
                                value={question}
                                onChangeText={value => {
                                    if (value.length < QUESTION_MAX_LENGHT)
                                        onChange({ question: value });
                                }}
                            />
                        </View>

                        <View style={stylecom.container_buttons}>
                            <Text style={styles.h4}>Opciones:</Text>
                        </View>
                        <View style={stylecom.input2}>
                            {answers.map(answer => (
                                <AnswerOption
                                    answer={answer}
                                    key={answer.id}
                                    answers={answers}
                                    handleOnBlurAnswer={handleOnBlurAnswer}
                                    handleChangeAnswers={handleChangeAnswers}
                                />
                            ))}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <ToggleButton
                                isActive={isSuperAnonymous}
                                setIsActive={setIsSuperAnonymous}
                                text={['Super', 'anónimo']}
                            />
                            <ButtonIcon
                                disabled={isLoading || invalid()}
                                icon={faLocationArrow}
                                onPress={handleCreatePoll}
                                style={{ marginRight: 2 }}
                                iconStyle={{ transform: [{ rotate: '45deg' }] }}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};

interface AnswerOptionProp {
    answer: Answer;
    answers: Answer[];
    handleOnBlurAnswer: (
        answer: Answer,
        fadeIn: (duration?: number, callback?: () => void) => void
    ) => void;
    handleChangeAnswers: (answer: Answer) => void;
}

const AnswerOption = ({
    answer,
    answers,
    handleOnBlurAnswer,
    handleChangeAnswers,
}: AnswerOptionProp) => {
    const { opacity, fadeIn, fadeOut } = useAnimation({ init_opacity: 0 });
    function handleSubmit(a: Answer) {
        if (a.id === answers[answers.length - 1].id || a.answer.length === 0) {
            Keyboard.dismiss();
        } else {
            answers[a.id].ref.current?.focus();
        }
    }
    useEffect(() => {
        fadeIn(350);
    }, [answer]);

    return (
        <Animated.View
            style={[
                answer.id > 1 ? { borderTopColor: '#eeeeee', borderTopWidth: 2 } : {},
                { paddingHorizontal: 20, paddingVertical: 10, opacity },
            ]}
        >
            <TextInput
                placeholder="Añadir"
                placeholderTextColor="#707070"
                style={{
                    ...styles.textinput,
                    fontSize: 16,
                }}
                value={answer.answer}
                returnKeyType={'next'}
                ref={answer.ref}
                onBlur={() => handleOnBlurAnswer(answer, fadeOut)}
                onSubmitEditing={() => handleSubmit(answer)}
                onChangeText={value =>
                    handleChangeAnswers({
                        id: answer.id,
                        answer: value,
                        ref: answer.ref,
                    })
                }
            />
            {answer.duplicated && (
                <View style={{ marginTop: 5 }}>
                    <Text style={[styles.textbold, styles.error]}>Ya existe esta opción</Text>
                </View>
            )}
        </Animated.View>
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
        paddingHorizontal: 25,
        paddingTop: 30,
    },
    input1: {
        ...styles.input,
        width: '100%',
        marginBottom: 15,
    },
    input2: {
        ...styles.shadow,
        width: '100%',
        marginBottom: 15,
        borderRadius: 4,
    },
    button: {
        ...styles.center,
        ...styles.shadow_button,
        flexDirection: 'row',
        backgroundColor: '#D4D4D4',
        borderRadius: 5,
    },
    container_buttons: {
        marginVertical: 10,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    back_arrow: {
        justifyContent: 'flex-start',
        flexDirection: 'row',
        marginBottom: 10,
        width: '100%',
    },
});
