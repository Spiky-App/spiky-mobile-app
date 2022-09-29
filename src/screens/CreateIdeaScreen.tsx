import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MentionInput } from 'react-native-controlled-mentions';
import { faLocationArrow, faPenToSquare } from '../constants/icons/FontAwesome';
import { styles } from '../themes/appTheme';
import { useForm } from '../hooks/useForm';
import { DrawerParamList } from '../navigator/MenuMain';
import { DrawerNavigationProp, DrawerScreenProps } from '@react-navigation/drawer';
import { RootStackParamList } from '../navigator/Navigator';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { RootState } from '../store';
import SpikyService from '../services/SpikyService';
import { addToast } from '../store/feature/toast/toastSlice';
import { addMessage, setDraft, updateMessage } from '../store/feature/messages/messagesSlice';
import { Message } from '../types/store';
import { StatusType } from '../types/common';
import ButtonIcon from '../components/common/ButtonIcon';
import { generateMessageFromMensaje } from '../helpers/message';
import { MentionData } from 'react-native-controlled-mentions/dist/types';
import { renderSuggetions } from '../components/Suggestions';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { faFlagCheckered } from '@fortawesome/free-solid-svg-icons';

type NavigationProp = DrawerNavigationProp<DrawerParamList>;
type Props = DrawerScreenProps<RootStackParamList, 'CreateIdeaScreen'>;

export const CreateIdeaScreen = ({ route }: Props) => {
    const draftedIdea = route.params?.draftedIdea;
    const idDraft = route.params?.draftID;
    const isDraft = idDraft !== undefined;
    const dispatch = useAppDispatch();
    const config = useAppSelector((state: RootState) => state.serviceConfig.config);
    const { nickname, universityId } = useAppSelector((state: RootState) => state.user);
    const { form, onChange } = useForm({
        message: draftedIdea || '',
    });
    const nav = useNavigation<NavigationProp>();
    const [counter, setCounter] = useState(0);
    const [isLoading, setLoading] = useState(false);

    const service = new SpikyService(config);
    const IDEA_MAX_LENGHT = 220;

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

    async function createMessage(message: string, draft?: boolean) {
        let createdMessage: Message | undefined = undefined;
        try {
            const response = await service.createMessage(message, draft ? 1 : 0);
            const { data } = response;
            const { mensaje } = data;
            createdMessage = generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: nickname,
                    id_universidad: universityId,
                },
            });
        } catch {
            dispatch(addToast({ message: 'Error creando idea', type: StatusType.WARNING }));
        }
        return createdMessage;
    }
    async function updateDraft(message: string, id: number, post: boolean) {
        let createdMessage: Message | undefined = undefined;
        try {
            const response = await service.updateDraft(message, id, post);
            const { data } = response;
            const { mensaje } = data;
            createdMessage = generateMessageFromMensaje({
                ...mensaje,
                usuario: {
                    alias: nickname,
                    id_universidad: universityId,
                },
            });
        } catch {
            dispatch(
                addToast({ message: 'Error actualizando borrador', type: StatusType.WARNING })
            );
        }
        return createdMessage;
    }
    const { draft } = useAppSelector((state: RootState) => state.messages);
    async function onPressLocationArrow() {
        setLoading(true);
        const message = idDraft
            ? await updateDraft(form.message, idDraft, true)
            : await createMessage(form.message);
        if (message) {
            dispatch(setDraft(false));
            nav.navigate('CommunityScreen');
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
            const message = await updateDraft(form.message, idDraft, false);
            if (message) {
                if (draft) {
                    dispatch(updateMessage(message));
                }
                nav.goBack();
                dispatch(
                    setModalAlert({
                        isOpen: true,
                        text: 'Borrador actualizado.',
                        icon: faPenToSquare,
                    })
                );
            }
        } else {
            const message = await createMessage(form.message, true);
            if (message) {
                if (draft) {
                    dispatch(addMessage(message));
                }
                nav.goBack();
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
        <SafeAreaView style={stylecom.container}>
            <KeyboardAvoidingView behavior="height" style={stylecom.container}>
                <View style={{ height: '40%' }}>
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
                                    renderSuggetions({ ...props, isMention: true }),
                                textStyle: { ...styles.h5, color: '#5c71ad' },
                                allowedSpacesCount: 0,
                                isInsertSpaceAfterMention: true,
                                isBottomMentionSuggestionsRender: true,
                                getPlainString: ({ name }: MentionData) => name,
                            },
                            {
                                trigger: '#',
                                renderSuggestions: props =>
                                    renderSuggetions({ ...props, isMention: false }),
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
                        width: '100%',
                        position: 'absolute',
                        bottom: Platform.OS === 'ios' ? 70 : 50,
                    }}
                >
                    <TouchableOpacity onPress={() => nav.goBack()} disabled={isLoading}>
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const stylecom = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 15,
        marginHorizontal: 20,
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
