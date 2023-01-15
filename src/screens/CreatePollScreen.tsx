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
} from 'react-native';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { BackgroundPaper } from '../components/BackgroundPaper';
import ButtonIcon from '../components/common/ButtonIcon';
import { faLocationArrow, faXmark } from '../constants/icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../navigator/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAnimation } from '../hooks/useAnimation';

type NavigationStackProp = StackNavigationProp<RootStackParamList>;
interface Answer {
    id: number;
    answer: string;
    ref: React.RefObject<TextInput>;
}

export const CreatePollScreen = () => {
    const navigation = useNavigation<NavigationStackProp>();
    const [isLoading] = useState(false);
    const { form, onChange } = useForm({
        question: '',
        answers: [
            { id: 1, answer: '', ref: createRef<TextInput>() },
            { id: 2, answer: '', ref: createRef<TextInput>() },
        ],
    });
    const { question, answers } = form;

    function invalid() {
        if (question === '' || answers[0].answer === '' || answers[1].answer === '') {
            return true;
        }
        return false;
    }

    function handleChangeAnswers(answer: Answer) {
        let newAnswer = answers.map(a => {
            if (answer.id === a.id) {
                return answer;
            } else {
                return a;
            }
        });
        if (answers[answers.length - 1].id === answer.id && answer.answer.length > 0) {
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
            fadeOut(350, () => onChange({ answers: newAnswer }));
        }
    }

    return (
        <BackgroundPaper style={stylecom.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={stylecom.container}
                >
                    <View style={{ marginVertical: 10 }}>
                        <Text style={styles.h4}>Pregunta:</Text>
                        <View style={{ position: 'absolute', top: -5, right: 5 }}>
                            <ButtonIcon
                                disabled={isLoading}
                                icon={faXmark}
                                onPress={() => navigation.goBack()}
                                style={{ height: 24, width: 24, backgroundColor: '#D4D4D4' }}
                            />
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
                            onChangeText={value => onChange({ question: value })}
                        />
                    </View>

                    <View style={{ marginVertical: 10 }}>
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
                    <View style={stylecom.container_buttons}>
                        <ButtonIcon
                            disabled={isLoading || invalid()}
                            icon={faLocationArrow}
                            onPress={() => {}}
                            iconStyle={{ transform: [{ rotate: '45deg' }] }}
                        />
                    </View>
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
        if (a.id === answers[answers.length - 1].id && a.answer.length === 0) {
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
        </Animated.View>
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
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
});
