import { DrawerScreenProps } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { BackgroundPaper } from '../components/BackgroundPaper';
import ButtonIcon from '../components/common/ButtonIcon';
import { faChevronLeft, faFlag } from '../constants/icons/FontAwesome';
import { useForm } from '../hooks/useForm';
import useSpikyService from '../hooks/useSpikyService';
import { RootStackParamList } from '../navigator/Navigator';
import { RootState } from '../store';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setMessages } from '../store/feature/messages/messagesSlice';
import { styles } from '../themes/appTheme';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

type Props = DrawerScreenProps<RootStackParamList, 'ReportIdeaScreen'>;

export const ReportIdeaScreen = ({ route }: Props) => {
    const uid = useAppSelector((state: RootState) => state.user.id);
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const [counter, setCounter] = useState(0);
    const [buttonState, setButtonState] = useState(false);
    const { createReportIdea } = useSpikyService();
    const { form, onChange } = useForm({
        reportReason: '',
    });
    const ideaId = route.params?.ideaId;
    const messages = useAppSelector((state: RootState) => state.messages.messages);

    const { reportReason } = form;

    const handleCreateReportIdea = () => {
        setButtonState(false);
        createReportIdea(ideaId, reportReason, uid);
        dispatch(setModalAlert({ isOpen: true, text: 'Mensaje reportado.', icon: faFlag }));
        const messagesUpdated = messages.filter(msg => msg.id !== ideaId);
        dispatch(setMessages(messagesUpdated));
        onChange({ reportReason: '' });
        navigation.goBack();
    };

    useEffect(() => {
        setCounter(220 - reportReason.length);
        if (reportReason.length <= 220 && reportReason.length > 0) {
            if (!buttonState) {
                setButtonState(true);
            }
        } else {
            setButtonState(false);
        }
    }, [reportReason]);

    return (
        <BackgroundPaper style={stylecom.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={stylecom.container}
            >
                <View style={{ width: '100%', flex: 1, alignItems: 'center' }}>
                    <View style={stylecom.back_arrow}>
                        <Pressable onPress={() => navigation.goBack()} style={{ paddingRight: 6 }}>
                            <FontAwesomeIcon icon={faChevronLeft} color={'#01192E'} size={22} />
                        </Pressable>
                        <Text style={styles.h3}>
                            Crear reporte<Text style={styles.orange}>.</Text>
                        </Text>
                    </View>
                    <View style={stylecom.wrap}>
                        <TextInput
                            placeholder="Motivo del reporte"
                            placeholderTextColor="#707070"
                            style={{ ...styles.textinput, fontSize: 16, fontWeight: '300' }}
                            multiline={true}
                            onChangeText={value => onChange({ reportReason: value })}
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
                                        style={{
                                            ...(counter < 0
                                                ? stylecom.MaxCounterNIdeaColorRed
                                                : stylecom.MaxCounterNIdeaColor),
                                            width:
                                                ((reportReason.length < 220
                                                    ? reportReason.length
                                                    : 220) /
                                                    220) *
                                                    100 +
                                                `%`,
                                        }}
                                    ></View>
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
                            disabled={!buttonState}
                            icon={faFlag}
                            onPress={handleCreateReportIdea}
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
