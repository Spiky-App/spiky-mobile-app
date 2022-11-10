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
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faAddressCard, faCircleInfo, faEye, faEyeSlash } from '../constants/icons/FontAwesome';
import { BackgroundPaper } from '../components/BackgroundPaper';
import { useForm } from '../hooks/useForm';
import { styles } from '../themes/appTheme';
import { ArrowBack } from '../components/ArrowBack';
import { BigTitle } from '../components/BigTitle';
import { PasswordValidationMsg } from '../components/PasswordValidationMsg';
import { useAppDispatch } from '../store/hooks';
import { StatusType } from '../types/common';
import { addToast } from '../store/feature/toast/toastSlice';
import { setModalAlert } from '../store/feature/ui/uiSlice';
import { useNavigation } from '@react-navigation/native';

const initialSate = {
    alias: '',
    password: '',
    confirmPassword: '',
};

export const RegisterScreen = ({ route }) => {

    const params = route.params || {};
    const { token, correoValid } = params;

    const dispatch = useAppDispatch();
    const [buttonState, setButtonState] = useState(false);
    const [passVisible1, setPassVisible1] = useState(true);
    const [passVisible2, setPassVisible2] = useState(true);
    const [msgPassword, setMsgPassword] = useState(false);
    const [passwordValid, setPasswordValid] = useState(false);
    const navigation = useNavigation<any>();
    const { form, onChange } = useForm(initialSate);

    const { alias, password, confirmPassword } = form;

    const register = async () => {
        if (passwordValid && password === confirmPassword) {
            try {
                // TODO: register user from hook to backend here
                onChange(initialSate);
                dispatch(
                    setModalAlert({
                        isOpen: true,
                        text: 'Registro exitoso',
                        icon: faAddressCard,
                    })
                );
                navigation.navigate('LoginScreen');
            } catch (error) {
                console.log(error);
                dispatch(addToast({ message: 'Cambio no completado', type: StatusType.WARNING }));
            }
        } else if (!passwordValid) {
            dispatch(
                addToast({
                    message: 'La contraseña no cumple los criterios',
                    type: StatusType.WARNING,
                })
            );
        } else if (password !== confirmPassword) {
            dispatch(
                addToast({
                    message: 'Las contraseñas no coinciden',
                    type: StatusType.WARNING,
                })
            );
        }
    };

    useEffect(() => {
        if (alias != '' && password !== '' && confirmPassword !== '') {
            setButtonState(true);
        }
    }, [password, confirmPassword, alias]);

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
});
