import React, { useEffect } from 'react';
import { useState } from 'react';
import {
    Text,
    View,
    TextInput,
    Keyboard,
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    Pressable,
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCheck, faCircleInfo, faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';
import { ArrowBack } from '../components/ArrowBack';
import { BigTitle } from '../components/BigTitle';
import { PasswordValidationMsg } from '../components/PasswordValidationMsg';
import { useAppDispatch } from '../store/hooks';
import { StatusType } from '../types/common';
import { addToast } from '../store/feature/toast/toastSlice';
import { useNavigation } from '@react-navigation/native';
import useSpikyService from '../hooks/useSpikyService';
import { validatePasswordFields } from '../helpers/passwords';
import { RootStackParamList } from '../navigator/Navigator';
import { DrawerScreenProps } from '@react-navigation/drawer';

const initialSate = {
    alias: '',
    password: '',
    confirmPassword: '',
    checkTermsConditions: false,
};

type Props = DrawerScreenProps<RootStackParamList, 'RegisterScreen'>;

export const RegisterScreen = ({ route }: Props) => {
    const token = route.params?.token;
    const correoValid = route.params?.correoValid;
    const dispatch = useAppDispatch();
    const [buttonState, setButtonState] = useState(false);
    const [passVisible1, setPassVisible1] = useState(true);
    const [passVisible2, setPassVisible2] = useState(true);
    const [msgPassword, setMsgPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const navigation = useNavigation<any>();
    const { form, onChange } = useForm(initialSate);
    const { registerUser } = useSpikyService();

    const { alias, password, confirmPassword, checkTermsConditions } = form;

    const register = async () => {
        const passwordErrors = validatePasswordFields(password, passwordValid, confirmPassword);
        if (checkTermsConditions) {
            if (passwordErrors === undefined) {
                try {
                    await registerUser(token, alias, correoValid, password);
                    navigation.navigate('ManifestPart2Screen', { correoValid, password });
                    onChange(initialSate);
                } catch (error) {
                    console.log(error);
                    dispatch(
                        addToast({ message: 'Cambio no completado', type: StatusType.WARNING })
                    );
                }
            } else {
                dispatch(addToast(passwordErrors));
            }
        } else {
            dispatch(
                addToast({
                    message: 'Términos y condiciones sin aceptar.',
                    type: StatusType.WARNING,
                })
            );
        }
    };

    useEffect(() => {
        if (alias != '' && password !== '' && confirmPassword !== '' && checkTermsConditions) {
            setButtonState(true);
        }
        if (
            (alias === '' || password === '' || confirmPassword === '' || !checkTermsConditions) &&
            buttonState
        ) {
            setButtonState(false);
        }
    }, [password, confirmPassword, alias, checkTermsConditions]);

    return (
        <BackgroundPaper>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <ArrowBack />
                    <BigTitle texts={['Escribe eso', 'que no saben']} />

                    <Text style={stylescomp.textEmail}>{correoValid}</Text>

                    <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                        <TextInput
                            placeholder="Seudónimo"
                            placeholderTextColor="#707070"
                            autoCorrect={false}
                            autoCapitalize="none"
                            style={styles.textinput}
                            value={alias}
                            onChangeText={value => onChange({ alias: value })}
                        />
                        <TouchableOpacity style={styles.iconinput}>
                            <FontAwesomeIcon icon={faCircleInfo} size={16} color="#d4d4d4" />
                        </TouchableOpacity>
                    </View>

                    <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                        <TextInput
                            placeholder="Contraseña"
                            placeholderTextColor="#707070"
                            secureTextEntry={passVisible1}
                            autoCorrect={false}
                            style={styles.textinput}
                            value={password}
                            onChangeText={value => onChange({ password: value })}
                            onFocus={() => setMsgPassword(true)}
                            onBlur={() => setMsgPassword(false)}
                        />
                        <TouchableOpacity
                            style={styles.iconinput}
                            onPress={() => setPassVisible1(!passVisible1)}
                        >
                            <FontAwesomeIcon
                                icon={passVisible1 ? faEye : faEyeSlash}
                                size={16}
                                color="#d4d4d4"
                            />
                        </TouchableOpacity>

                        {msgPassword && (
                            <PasswordValidationMsg
                                password={password}
                                setPasswordValid={setPasswordValid}
                            />
                        )}
                    </View>

                    <View style={{ ...styles.input, marginBottom: 20, width: 280 }}>
                        <TextInput
                            placeholder="Confirmar contraseña"
                            placeholderTextColor="#707070"
                            autoCorrect={false}
                            secureTextEntry={passVisible2}
                            style={styles.textinput}
                            value={confirmPassword}
                            onChangeText={value => onChange({ confirmPassword: value })}
                        />
                        <TouchableOpacity
                            style={styles.iconinput}
                            onPress={() => setPassVisible2(!passVisible2)}
                        >
                            <FontAwesomeIcon
                                icon={passVisible2 ? faEye : faEyeSlash}
                                size={16}
                                color="#d4d4d4"
                            />
                        </TouchableOpacity>
                    </View>

                    <Pressable
                        style={{ ...styles.center, marginBottom: 10 }}
                        onPress={() => navigation.navigate('TermAndConditionsScreen')}
                    >
                        <Text style={{ ...styles.textbold, fontSize: 13 }}>
                            Ver términos y condiciones
                        </Text>
                    </Pressable>

                    <Pressable
                        style={stylescomp.containercheckBox}
                        onPress={() => onChange({ checkTermsConditions: !checkTermsConditions })}
                    >
                        <View
                            style={{
                                ...stylescomp.checkBox,
                                backgroundColor: checkTermsConditions ? '#01192E' : 'transparent',
                            }}
                        >
                            {checkTermsConditions && (
                                <FontAwesomeIcon icon={faCheck} size={13} color="white" />
                            )}
                        </View>
                        <Text style={{ ...styles.text, fontSize: 12 }}>
                            He leído y acepto los términos y condiciones de uso.
                        </Text>
                    </Pressable>

                    <TouchableOpacity
                        style={{
                            ...styles.button,
                            marginTop: 20,
                            borderColor: buttonState ? '#01192E' : '#D4D4D4',
                        }}
                        onPress={buttonState ? register : () => {}}
                    >
                        <Text
                            style={{
                                ...styles.text,
                                fontSize: 14,
                                color: buttonState ? '#01192E' : '#D4D4D4',
                            }}
                        >
                            Crear cuenta
                        </Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </BackgroundPaper>
    );
};

const stylescomp = StyleSheet.create({
    textEmail: {
        ...styles.textGrayPad,
        marginVertical: 15,
        fontSize: 14,
        width: 350,
        textAlign: 'center',
    },
    checkBox: {
        ...styles.center,
        width: 18,
        height: 18,
        borderWidth: 2,
        borderRadius: 5,
        borderColor: '#01192E',
        marginRight: 10,
    },
    containercheckBox: {
        ...styles.center,
        width: 220,
        marginVertical: 10,
        flexDirection: 'row',
    },
});
